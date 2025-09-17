import * as React from "react";
import { Card, CardContent } from "@/components/ui/Card";

type Person = { role: string; name: string; phone: string };
type ContactsProps = { people: Person[] };

export function Contacts({ people }: ContactsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {people.map((p, i) => (
        <Card key={i}>
          <CardContent>
            <div className="text-xs text-foreground/60">{p.role}</div>
            <div className="text-sm font-medium">{p.name}</div>
            <a className="mt-1 inline-block text-xs text-blue-600 dark:text-blue-400 underline" href={`tel:${p.phone}`}>
              {p.phone}
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Contacts;


