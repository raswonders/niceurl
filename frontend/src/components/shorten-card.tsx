import {
  Card,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRef } from "react";

export function ShortenCard() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Card className="basis-1/4">
      <form ref={formRef} method="POST" action="http://localhost:3000/shorten">
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
