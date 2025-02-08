import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRef } from "react";

export function ShortenCard() {
  const formRef = useRef<HTMLFormElement>(null);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let formData = new FormData(e.currentTarget);
    let data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("http://localhost:3000/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        console.log("Error on fetch", res.status, res.statusText);
        return;
      }
    } catch (error) {
      console.error("Form wasn't submitted: ", error);
    }
  }

  return (
    <Card className="basis-1/4">
      <form ref={formRef} onSubmit={(e) => handleSubmit(e)}>
        <CardHeader>
          <Label htmlFor="url">Shorten long url</Label>
          <Input type="text" name="url" placeholder="Enter your url" />
        </CardHeader>
        <CardFooter>
          <Button onClick={() => formRef.current?.submit()}>Shorten</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
