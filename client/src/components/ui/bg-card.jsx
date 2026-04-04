"use client";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import openaiIcon from "@/assets/openai.png";
import claudeIcon from "@/assets/claude.png";
import geminiIcon from "@/assets/gemini.png";
import grokIcon from "@/assets/grok.png";
import v0Icon from "@/assets/v0.png";
import perplexityIcon from "@/assets/perplexity.png";
import sciraIcon from "@/assets/scira.png";
import copyIcon from "@/assets/copy.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldContent,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Mail, RefreshCcw, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import axios from "axios";

function validateURL(value) {
  if (!value.trim()) {
    return "URL is required";
  }
  const urlRegex = /^(https?:\/\/)?(www\.)?(chatgpt\.com|claude\.ai|grok\.com)\//i;
  if (!urlRegex.test(value)) {
    return "Please enter a valid chat URL";
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

const handleDelete = async (setOpen) => {
  const value = localStorage.getItem("r-chatUrls");

  if (!value) {
    return toast('No chat history present in the system', { position: "top-center" });
  }

  let ids = [];
  try {
    ids = JSON.parse(value);
  } catch (err) {
    console.error(err);
  }

  if (ids.length === 0) {
    return toast('No chat history present in the system', { position: "top-center" });
  }

  try {
    await axios.delete('http://localhost:5000/api/purge', { data: { ids } });

    localStorage.removeItem("r-chatUrls");
    toast("Success! All chats purged.", { position: "top-center" });
    setOpen(false)
  } catch (error) {
    console.error(error);
    toast("Failed to purge", { position: "top-center" });
  }
}

function URLField({ id, value, onChange }) {
  return (
    <Field className='font-jetbrains'>
      <FieldContent>
        <InputGroup className="rounded-none">
          {/* <InputGroupAddon>
            <Mail aria-hidden="true" className="size-4" />
          </InputGroupAddon> */}
          <InputGroupInput
            id={id}
            onChange={onChange}
            placeholder="Paste your chat url"
            value={value} />
        </InputGroup>
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
            This will instantly purge all your transferred chats from the server. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row gap-4 justify-end mt-4">
          <Button className="rounded-none cursor-pointer bg-black hover:bg-[#413d3d] text-white" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="rounded-none bg-[#961223] hover:bg-[#7a0f1d] cursor-pointer" onClick={() => handleDelete(setOpen)}>
            Delete All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TOSDialog({ open, setOpen }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-none font-jetbrains">
        <DialogHeader>
          <DialogTitle>Privacy & Terms</DialogTitle>
          <DialogDescription>
            Your privacy is built-in. We temporarily host your chat on secure third-party servers to make the transfer work, then permanently delete it within an hour. We never track you, sell data, or train AI. Our code is fully <a className="underline text-black" href="https://git.new/reminiscence">open-source</a>, and <span className="text-black">we highly encourage self-hosting for total control.</span>
            <br /> <br />
            Because this public instance is a free tool, it is provided "as is" without guarantees. Please do not transfer illegal or sensitive personal data.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row gap-4 justify-end mt-4">
          <Button className="rounded-none bg-[#961223] hover:bg-[#7a0f1d] cursor-pointer" onClick={() => setOpen(false)}>
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function BgCard({
  onSubmit,
  className,
  defaultUrl = "",
  isLoading = false,
  errors,
}) {
  const [url, setUrl] = useState(defaultUrl);
  const [spinning, setSpinning] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [tosOpen, setTosOpen] = useState(false);
  const [id, setId] = useState('');

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const urlError = validateURL(url);

    if (urlError) {
      toast(urlError, { position: "top-center" });
      return;
    }

    setSpinning(true);
    let formData = { url: url.trim() };

    try {
      const response = await axios.post('http://localhost:5000/api/serialize', formData);
      toast("Success", { position: "top-center" });
      onSubmit?.(url.trim());

      const newId = response.data?.id;
      setId(newId)
      localStorage.setItem('r-currentSession', JSON.stringify(newId));
      if (newId) {
        let existingIds = [];
        try {
          const stored = localStorage.getItem('r-chatUrls');
          existingIds = stored ? JSON.parse(stored) : [];
          if (!Array.isArray(existingIds)) existingIds = [existingIds];
        } catch (e) {
          existingIds = [];
        }

        if (!existingIds.includes(newId)) {
          existingIds.push(newId);
          localStorage.setItem('r-chatUrls', JSON.stringify(existingIds));
        }
      }
    } catch (error) {
      console.error(error);
      toast("Failed", { position: "top-center" });
    } finally {
      setSpinning(false);
    }
  }, [url, onSubmit]);

  const handleUrlChange = useCallback((e) => {
    setUrl(e.target.value);
  }, []);

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
            <URLField
              onChange={handleUrlChange}
              value={url} />

            <Button
              aria-busy={isLoading}
              className="h-9 w-36 cursor-pointer touch-manipulation rounded-none shrink-0"
              data-loading={isLoading}
              disabled={isLoading}
              type="submit">
              <>
                Submit
              </>
            </Button>
            <Button
              className="h-9 w-9 cursor-pointer bg-[#961223] touch-manipulation rounded-none shrink-0"
              // disabled={!url.trim()}
              onClick={() => setDeleteOpen(true)}
              size="icon"
              type="button">
              <>
                <Trash2 />
              </>
            </Button>
            <Button
              className="h-9 w-9 cursor-pointer bg-[#322f2f] touch-manipulation rounded-none shrink-0"
              size="icon"
              type="button"
              onClick={() => {
                localStorage.setItem('r-currentSession', JSON.stringify(''));
                setId('');
                setUrl('');
              }}>
              <>
                <RefreshCcw />
              </>
            </Button>
            <DeleteDialog open={deleteOpen} setOpen={setDeleteOpen} />
          </div>
          <div className="-mt-4">
            <p className="text-black text-[11px] mb-6">By clicking Submit, you agree to our <a className="underline cursor-pointer" onClick={() => setTosOpen(true)}>Privacy & Terms</a>
              <TOSDialog open={tosOpen} setOpen={setTosOpen} />.{id && <>&nbsp;&nbsp; Current session: {id}</>}</p>
            <hr className="border-t border-gray-600 -mx-6" />
          </div>
          <p className="-my-1 mx-1 pl-36">Works with any LLM's itw.</p>
          <div className="flex flex-row-auto gap-8">
            <a className={!id ? "pointer-events-none" : ""} href={`https://chatgpt.com/?q=Hi!%20Can%20you%20please%20read%20my%20past%20chat%20context%5Bhere%5D(https%3A%2F%2Flmfiles.com%2Ff%2F${id})%20and%20resume%20this%20conversation%3F`} target="_blank" rel="noopener noreferrer">
              <Button
                disabled={!id}
                variant="outline"
                title="ChatGPT"
                className="size-12 cursor-pointer"
                size="icon"
                type="button"
              >
                <img src={openaiIcon} alt="ChatGPT" className="size-10" />
              </Button>
            </a>
            <a className={!id ? "pointer-events-none" : ""} href={`https://claude.ai/new?q=Hi!%20Can%20you%20please%20read%20my%20past%20chat%20context%20%5Bhere%5D(https%3A%2F%2Flmfiles.com%2Ff%2F${id})%20and%20resume%20this%20conversation%3F`} target="_blank" rel="noopener noreferrer">
              <Button disabled={!id} type="button" variant="outline" title="Claude" className="size-12 cursor-pointer" size="icon">
                <img src={claudeIcon} alt="Claude" className="size-10" />
              </Button>
            </a>
            {/* <a className={!id ? "pointer-events-none" : ""} href={`https://gemini.google.com/app?q=Hi!%20Can%20you%20please%20read%20my%20past%20chat%20context%20%5Bhere%5D(https%3A%2F%2Flmfiles.com%2Ff%2F${id})%20and%20resume%20this%20conversation%3F`} target="_blank" rel="noopener noreferrer">
              <Button disabled={!id} type="button" variant="outline" title="Gemini" className="size-12 cursor-pointer" size="icon">
                <img src={geminiIcon} alt="Gemini" className="size-8" />
              </Button>
            </a> */}

            <a className={!id ? "pointer-events-none" : ""} href={`https://grok.com/?q=Hi!%20Can%20you%20please%20read%20my%20past%20chat%20context%20%5Bhere%5D(https%3A%2F%2Flmfiles.com%2Ff%2F${id})%20and%20resume%20this%20conversation%3F`} target="_blank" rel="noopener noreferrer">
              <Button disabled={!id} type="button" variant="outline" title="Grok" className="size-12 cursor-pointer" size="icon">
                <img src={grokIcon} alt="Grok" className="size-8" />
              </Button>
            </a>

            <a className={!id ? "pointer-events-none" : ""} href={`https://scira.ai/?q=Hi!%20Can%20you%20please%20read%20my%20past%20chat%20context%20%5Bhere%5D(https%3A%2F%2Flmfiles.com%2Ff%2F${id})%20and%20resume%20this%20conversation%3F`} target="_blank" rel="noopener noreferrer">
              <Button disabled={!id} type="button" variant="outline" title="Scira" className="size-12 cursor-pointer" size="icon">
                <img src={sciraIcon} alt="Scira" className="size-8" />
              </Button>
            </a>
            <a className={!id ? "pointer-events-none" : ""} href={`https://v0.dev/?q=Hi!%20Can%20you%20please%20read%20my%20past%20chat%20context%20%5Bhere%5D(https%3A%2F%2Flmfiles.com%2Ff%2F${id})%20and%20resume%20this%20conversation%3F`} target="_blank" rel="noopener noreferrer">
              <Button disabled={!id} type="button" variant="outline" title="v0" className="size-12 cursor-pointer" size="icon">
                <img src={v0Icon} alt="v0" className="size-8" />
              </Button>
            </a>
            <a className={!id ? "pointer-events-none" : ""} href={`https://www.perplexity.ai/?q=Hi!%20Can%20you%20please%20read%20my%20past%20chat%20context%20%5Bhere%5D(https%3A%2F%2Flmfiles.com%2Ff%2F${id})%20and%20resume%20this%20conversation%3F`} target="_blank" rel="noopener noreferrer">
              <Button disabled={!id} type="button" variant="outline" title="Perplexity" className="size-12 cursor-pointer" size="icon">
                <img src={perplexityIcon} alt="Perplexity" className="size-8" />
              </Button>
            </a>
            <Button
              disabled={!id}
              type="button"
              variant="outline"
              title="Copy and paste to any other LLM's"
              className="size-12 cursor-pointer"
              size="icon"
              onClick={() => {
                const prompt = `Hi! Can you please read my past chat context [here](https://lmfiles.com/f/${id}) and resume this conversation?`;
                navigator.clipboard.writeText(prompt);
                toast("Copied, Paste it in any other LLM's", { position: "top-center" });
              }}
            >
              <img src={copyIcon} alt="Copy" className="size-7" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
