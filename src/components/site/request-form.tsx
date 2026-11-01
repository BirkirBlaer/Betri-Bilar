"use client";

import { useActionState, useEffect, useRef } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { sendRequest } from "@/app/actions/request";
import type { RequestFields, RequestState } from "@/lib/request-schema";
import { company } from "@/content/site";
import { cn } from "@/lib/utils";

const initial: RequestState = { status: "idle" };

export function RequestForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(sendRequest, initial);
  const startedRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef(0);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Time the visitor started — used to reject bots that submit instantly
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (state.status === "sent") formRef.current?.reset();
    if (state.status === "invalid") {
      const first = Object.keys(state.errors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    } else if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  const errors = state.status === "invalid" ? state.errors : {};
  const values = state.status === "invalid" ? state.values : {};

  if (state.status === "sent") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="border-t border-rule-dark pt-8 outline-none">
        <p className="h3 text-paper">Beiðnin er komin til okkar.</p>
        <p className="mt-4 max-w-[44ch] leading-relaxed text-paper/70">
          Við höfum samband eins fljótt og við getum á opnunartíma. Ef málið er brýnt er best að hringja í{" "}
          <a href={company.phone.href} className="text-paper underline underline-offset-4">
            {company.phone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={() => startedRef.current && (startedRef.current.value = String(startedAt.current))}
      noValidate className="space-y-7" aria-describedby="form-skyring">
      <p id="form-skyring" className="meta text-steel-light">
        Við höfum samband til að staðfesta tímann. Fylla þarf út öll svæði.
      </p>

      <Field name="name" label="Nafn" autoComplete="name" error={errors.name} defaultValue={values.name} />
      <Field
        name="contact"
        label="Sími eða netfang"
        autoComplete="on"
        inputMode="text"
        error={errors.contact}
        defaultValue={values.contact}
      />
      <Field
        name="vehicle"
        label="Bíll"
        hint="Tegund, gerð og árgerð, t.d. Škoda Octavia 2017"
        error={errors.vehicle}
        defaultValue={values.vehicle}
      />
      <Field name="message" label="Hvað er að?" textarea error={errors.message} defaultValue={values.message} />

      <fieldset aria-describedby={errors.method ? "method-error" : undefined}>
        <legend className="mb-3 text-sm text-paper/80">Hvernig viltu að við höfum samband?</legend>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["simi", "Hringið í mig"],
              ["netfang", "Sendið tölvupóst"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="relative cursor-pointer">
              <input
                type="radio"
                name="method"
                value={value}
                defaultChecked={(values.method ?? "simi") === value}
                className="peer sr-only"
              />
              <span className="inline-flex h-11 items-center rounded-full px-5 text-sm ring-1 ring-inset ring-rule-dark transition-colors peer-checked:bg-paper peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-signal hover:ring-paper/40">
                {label}
              </span>
            </label>
          ))}
        </div>
        {errors.method && (
          <p id="method-error" className="mt-2 text-sm text-signal">
            {errors.method}
          </p>
        )}
      </fieldset>

      {/* Spam protection: humans never see or fill this */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Vefsíða
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input ref={startedRef} type="hidden" name="t" defaultValue="0" />

      {!configured && (
        <p className="border-l-2 border-signal pl-4 text-sm leading-relaxed text-paper/75">
          Sýnisútgáfa: formið er ekki enn tengt við tölvupóst, svo beiðnir eru ekki sendar. Hringdu frekar í{" "}
          {company.phone.display}.
        </p>
      )}

      <div ref={statusRef} tabIndex={-1} role="alert" className="outline-none empty:hidden">
        {state.status === "not_configured" && (
          <p className="text-sm leading-relaxed text-signal">
            Beiðnin var ekki send — formið er ekki tengt ennþá. Hringdu í {company.phone.display} eða sendu póst á {company.email}.
          </p>
        )}
        {state.status === "rate_limited" && (
          <p className="text-sm leading-relaxed text-signal">
            Of margar beiðnir á stuttum tíma. Bíddu í nokkrar mínútur eða hringdu í {company.phone.display}.
          </p>
        )}
        {state.status === "failed" && (
          <p className="text-sm leading-relaxed text-signal">
            Beiðnin fór ekki í gegn. Reyndu aftur, eða hringdu í {company.phone.display}.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-signal pl-6 pr-2 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-paper disabled:opacity-70"
      >
        {pending ? "Sendi beiðni…" : "Senda beiðni"}
        <span aria-hidden className="relative grid size-9 place-items-center overflow-hidden rounded-full bg-ink text-paper">
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowUpRight className="size-4 transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.75} />
          )}
        </span>
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  hint,
  error,
  textarea,
  defaultValue,
  ...rest
}: {
  name: keyof RequestFields;
  label: string;
  hint?: string;
  error?: string;
  textarea?: boolean;
  defaultValue?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `f-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const base =
    "peer block w-full border-0 border-b bg-transparent px-0 py-3 text-[1.0625rem] text-paper placeholder:text-transparent focus:outline-none focus-visible:outline-none";
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-paper/80">
        {label}
      </label>
      <div className="relative">
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          defaultValue={defaultValue}
          required
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(base, "resize-y", error ? "border-signal" : "border-rule-dark")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type="text"
          defaultValue={defaultValue}
          required
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(base, error ? "border-signal" : "border-rule-dark")}
          {...rest}
        />
      )}
      {/* Focus line draws in from the left */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 block h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-500 ease-[var(--ease-out-quint)] peer-focus:scale-x-100"
      />
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-sm text-steel-light">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-signal">
          {error}
        </p>
      )}
    </div>
  );
}
