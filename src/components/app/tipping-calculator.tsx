"use client";

import { useState, useMemo, useCallback, useTransition } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DollarSign, Percent, Users, Sparkles, Loader2 } from "lucide-react";
import { getFairSplitSuggestion } from "@/app/actions";

const tipOptions = [10, 15, 20];

export function TippingCalculator() {
  const [bill, setBill] = useState("");
  const [selectedTip, setSelectedTip] = useState<number | "custom">(15);
  const [customTip, setCustomTip] = useState("");
  const [numPeople, setNumPeople] = useState("1");
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const billAmount = useMemo(() => parseFloat(bill) || 0, [bill]);
  const numberOfPeople = useMemo(() => parseInt(numPeople) || 1, [numPeople]);
  const tipPercentage = useMemo(() => {
    if (selectedTip === "custom") {
      return parseFloat(customTip) || 0;
    }
    return selectedTip;
  }, [selectedTip, customTip]);

  const tipAmount = useMemo(
    () => billAmount * (tipPercentage / 100),
    [billAmount, tipPercentage]
  );
  const totalAmount = useMemo(
    () => billAmount + tipAmount,
    [billAmount, tipAmount]
  );
  const perPersonAmount = useMemo(
    () => (totalAmount > 0 && numberOfPeople > 0 ? totalAmount / numberOfPeople : 0),
    [totalAmount, numberOfPeople]
  );

  const isTipUneven = useMemo(() => {
    if (numberOfPeople <= 1 || tipAmount === 0) return false;
    const tipInCents = Math.round(tipAmount * 100);
    return tipInCents % numberOfPeople !== 0;
  }, [tipAmount, numberOfPeople]);

  const handleFairSplitClick = useCallback(() => {
    startTransition(async () => {
      const result = await getFairSplitSuggestion(tipAmount, numberOfPeople);
      setAiSuggestion(result.suggestion);
    });
  }, [tipAmount, numberOfPeople]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-4xl font-bold text-primary">
          TipEase
        </CardTitle>
        <CardDescription className="text-foreground/80">
          Effortlessly calculate tips and split bills.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="bill" className="font-medium">Bill Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="bill"
              type="number"
              placeholder="0.00"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
              className="pl-10 text-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-medium">Select Tip %</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid grid-cols-3 gap-2 col-span-2">
            {tipOptions.map((tip) => (
              <Button
                key={tip}
                variant={selectedTip === tip ? "default" : "outline"}
                onClick={() => setSelectedTip(tip)}
                className="text-base py-6"
              >
                {tip}%
              </Button>
            ))}
            </div>
             <Button
                variant={selectedTip === "custom" ? "default" : "outline"}
                onClick={() => setSelectedTip("custom")}
                className="text-base py-6 col-span-1"
              >
                Custom
              </Button>
             <div className="relative col-span-1">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="custom-tip"
                  type="number"
                  placeholder="25"
                  value={customTip}
                  onChange={(e) => {
                    setCustomTip(e.target.value);
                    setSelectedTip("custom");
                  }}
                  className="pl-10 text-lg h-full"
                  disabled={selectedTip !== "custom"}
                />
              </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="num-people" className="font-medium">Split Between</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="num-people"
              type="number"
              min="1"
              value={numPeople}
              onChange={(e) => setNumPeople(e.target.value)}
              className="pl-10 text-lg"
            />
          </div>
        </div>
        
        <Separator />

        <div className="space-y-4 text-center">
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1 rounded-lg bg-accent/50 p-4">
                    <p className="text-sm text-muted-foreground">Tip Amount</p>
                    <p className="text-3xl font-bold font-headline tracking-tight text-primary transition-all duration-300">{formatCurrency(tipAmount)}</p>
                </div>
                 <div className="space-y-1 rounded-lg bg-accent/50 p-4">
                    <p className="text-sm text-muted-foreground">Total Bill</p>
                    <p className="text-3xl font-bold font-headline tracking-tight text-primary transition-all duration-300">{formatCurrency(totalAmount)}</p>
                </div>
            </div>
             {numberOfPeople > 1 && (
                 <div className="space-y-1 rounded-lg bg-primary/10 p-4">
                    <p className="text-sm text-primary/80">Each Person Pays</p>
                    <p className="text-5xl font-extrabold font-headline tracking-tighter text-primary transition-all duration-300">{formatCurrency(perPersonAmount)}</p>
                </div>
             )}
        </div>
      </CardContent>
      {isTipUneven && (
        <CardFooter className="flex-col gap-4">
          <Button onClick={handleFairSplitClick} disabled={isPending} className="w-full">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Get Fair Split Suggestion
          </Button>
          {aiSuggestion && (
            <Alert className="bg-primary/5 border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <AlertTitle className="font-headline text-primary">AI Suggestion</AlertTitle>
              <AlertDescription className="text-foreground/90">
                {aiSuggestion}
              </AlertDescription>
            </Alert>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
