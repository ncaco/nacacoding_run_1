import * as React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { CopyField } from "@/components/ui/CopyField";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/toast";
import { QrIcon, ChevronDownIcon } from "@/components/ui/icons";

type Account = { label: string; value: string };
type AccountsGroup = { groupTitle: string; accounts: Account[] };

type AccountsProps = {
  groom: AccountsGroup[];
  bride: AccountsGroup[];
};

function bankColor(name: string) {
  const map: Record<string, string> = {
    "국민": "#ffd400",
    "신한": "#0046FF",
    "우리": "#0067a3",
    "하나": "#00857c",
    "농협": "#077c39",
    "기업": "#0072bc",
    "카카오뱅크": "#fde500",
  };
  return map[name] || "#9ca3af";
}

function BankBadge({ name }: { name: string }) {
  const color = bankColor(name);
  return (
    <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded mr-1" style={{ backgroundColor: `${color}22`, color }}>
      {name}
    </span>
  );
}

function Side({ title, groups }: { title: string; groups: AccountsGroup[] }) {
  return (
    <Card>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <div className="mt-3 space-y-4">
          {groups.map((g, i) => (
            <div key={i}>
              <div className="text-xs text-foreground/60 mb-2">{g.groupTitle}</div>
              <div className="space-y-2">
                {g.accounts.map((acc, idx) => {
                  const bank = acc.value.split(" ")[0];
                  return (
                    <details key={idx} className="group rounded-lg border border-black/10 dark:border-white/10 bg-black/[.03] dark:bg-white/[.04] p-2">
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-center justify-between gap-3 px-1 py-1.5">
                          <div className="flex items-center gap-2">
                            <BankBadge name={bank} />
                            <span className="text-sm font-medium">{acc.label}</span>
                          </div>
                          <div className="flex items-center gap-2 text-foreground/60 text-[11px]">
                            <span className="group-open:hidden">상세</span>
                            <span className="hidden group-open:inline">닫기</span>
                            <ChevronDownIcon size={16} className="transition-transform group-open:rotate-180" />
                          </div>
                        </div>
                      </summary>
                      <div className="mt-2 space-y-2">
                        <CopyField label={acc.label} value={acc.value} />
                        <div className="rounded-md border border-black/10 dark:border-white/10 p-3 flex items-center justify-center text-foreground/60 text-xs bg-white/60 dark:bg-black/30">
                          <QrIcon size={18} />
                          <span className="ml-2">QR 이미지는 추후 업로드 가능합니다</span>
                        </div>
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function Accounts({ groom, bride }: AccountsProps) {
  const [tab, setTab] = React.useState<"groom" | "bride">("groom");
  const { push } = useToast();

  // 안내 메모
  const memo = "마음 전해주시는 모든 분들께 감사드립니다.";

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Tabs tabs={[{ value: "groom", label: "신랑측" }, { value: "bride", label: "신부측" }]} value={tab} onChange={(v) => setTab(v)} />
        <div className="text-[11px] text-foreground/60">{memo}</div>
      </div>
      {tab === "groom" ? (
        <Side title="신랑측" groups={groom} />
      ) : (
        <Side title="신부측" groups={bride} />
      )}
    </div>
  );
}

export default Accounts;


