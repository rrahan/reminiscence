"use client";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import openaiIcon from "@/assets/openai.png";
import claudeIcon from "@/assets/claude.png";
import geminiIcon from "@/assets/gemini.png";
import grokIcon from "@/assets/grok.png";
import perplexityIcon from "@/assets/perplexity.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Mail, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


function validateEmail(value) {
  if (!value.trim()) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return "Please enter a valid email address";
  }
  return;
}

function ErrorAlert({ message }) {
  return (
    <div
      aria-live="polite"
      className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-destructive text-sm"
      role="alert">
      {message}
    </div>
  );
}

function EmailField({ id, value, onChange, error }) {
  return (
    <Field data-invalid={!!error} className='font-jetbrains'>
      <FieldContent>
        <InputGroup aria-invalid={!!error} className="rounded-none">
          <InputGroupAddon>
            <Mail aria-hidden="true" className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            aria-describedby={error ? `${id}-error` : undefined}
            aria-invalid={!!error}
            autoComplete="email"
            id={id}
            inputMode="email"
            name="email"
            onChange={onChange}
            placeholder="Paste something"
            required
            type="email"
            value={value} />
        </InputGroup>
        {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
      </FieldContent>
    </Field>
  );
}

function DeleteDialog({ open, setOpen }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-none font-jetbrains">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row gap-4 justify-end mt-4">
          <Button className="rounded-none cursor-pointer bg-black hover:bg-[#413d3d] text-white" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="rounded-none bg-[#961223] hover:bg-[#7a0f1d] cursor-pointer" onClick={() => setOpen(false)}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function BgCard({
  onSubmit,
  className,
  defaultEmail = "",
  isLoading = false,
  errors,
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [localErrors, setLocalErrors] = useState({});
  const [spinning, setSpinning] = useState(false);
  const [open, setOpen] = useState(false)

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    const emailError = validateEmail(email);

    if (emailError) {
      setLocalErrors({ email: emailError });
      return;
    }

    setLocalErrors({});
    setSpinning(true);
    onSubmit?.(email.trim());
  }, [email, onSubmit]);

  const handleEmailChange = useCallback((e) => {
    const value = e.target.value;
    setEmail(value);
    if (localErrors.email) {
      setLocalErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  }, [localErrors.email]);

  const emailError = errors?.email || localErrors.email;
  const generalError = errors?.general;

  return (
    <Card className={cn("w-full max-w-2xl shadow-xs font-jetbrains rounded-none", className)}>
      <CardContent>
        <form className="flex flex-col gap-6 -mt-3" onSubmit={handleSubmit}>

          {generalError && <ErrorAlert message={generalError} />}

          <div className="flex flex-col gap-0">
            <p className="font-surgena pl-52 text-8xl text-[#961223] flex items-start">R<svg className={`w-[34px] h-[34px] inline-block mt-2 ${spinning ? 'animate-spin' : ''}`} viewBox="-0.054 0 4.272 4.272" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.432 3.576L0 2.832L1.476 2.148L0 1.452L0.432 0.695999L1.764 1.632L1.632 0H2.496L2.352 1.62L3.696 0.684L4.128 1.44L2.664 2.112L4.164 2.82L3.732 3.576L2.376 2.616L2.508 4.272H1.644L1.788 2.64L0.432 3.576Z" fill="#961223" /></svg></p>
          </div>

          <div className="flex items-end gap-3">
            <EmailField
              error={emailError}
              id="magic-link-email"
              onChange={handleEmailChange}
              value={email} />

            <Button
              aria-busy={isLoading}
              className="h-9 w-44 cursor-pointer touch-manipulation rounded-none shrink-0"
              data-loading={isLoading}
              disabled={isLoading}
              type="submit">
              <>
                Submit
              </>
            </Button>
            <Button
              className="h-9 w-9 cursor-pointer bg-[#961223] touch-manipulation rounded-none shrink-0"
              onClick={() => setOpen(true)}
              size="icon"
              type="button">
              <>
                <Trash2 />
              </>
            </Button>
            <DeleteDialog open={open} setOpen={setOpen} />
          </div>
          <div className="-mt-4">
            <p className="text-black text-[11px] mb-6">By clicking Submit, you agree to our [Terms] and [Privacy Policy].</p>
            <hr className="border-t border-gray-600 -mx-6" />
          </div>
          <p className="-my-1 mx-1 pl-48">Works with</p>
          <div className="flex flex-row-auto gap-12">
            <Button disabled variant="outline" title="ChatGPT" className="size-12 cursor-pointer" size="icon">
              <img src={openaiIcon} alt="ChatGPT" className="size-10" />
            </Button>
            <Button variant="outline" title="Claude" className="size-12 cursor-pointer" size="icon">
              <img src={claudeIcon} alt="Claude" className="size-10" />
            </Button>
            <Button variant="outline" title="Gemini" className="size-12 cursor-pointer" size="icon">
              <img src={geminiIcon} alt="Gemini" className="size-8" />
            </Button>
            <Button variant="outline" title="Grok" className="size-12 cursor-pointer" size="icon">
              <img src={grokIcon} alt="Grok" className="size-8" />
            </Button>
            <Button variant="outline" title="Perplexity" className="size-12 cursor-pointer" size="icon">
              <img src={perplexityIcon} alt="Perplexity" className="size-8" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
