import * as React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { CopyField } from "@/components/ui/CopyField";
import { PhoneIcon } from "@/components/ui/icons";

type ParentEntry = {
  roleLabel: string; // 예: "아버님 · 김영수"
  accountValue: string;
  phone?: string;
};

type AccountCardProps = {
  sideLabel: string; // "신랑측" | "신부측"
  primaryLabel: string; // "신랑측 계좌" 등
  primaryAccount: string;
  primaryPhone?: string;
  parents: ParentEntry[];
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

function BankBadge({ bank }: { bank: string }) {
  const color = bankColor(bank);
  return (
    <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${color}22`, color }}>
      {bank}
    </span>
  );
}

export function AccountCard({ sideLabel, primaryLabel, primaryAccount, primaryPhone, parents }: AccountCardProps) {
  return (
    <Card>
      <CardContent>
        {/* 상단 라벨 배지 */}
        <div className="mb-1.5">
          <span className="chip-outline">{sideLabel}</span>
        </div>

        {/* 대표 계좌: 라벨 + 전화 칩, 계좌 필드 */}
        <div className="mb-1.5 flex items-center justify-between">
          <div className="text-xs text-foreground/60">대표</div>
          {primaryPhone ? (
            <a className="chip" href={`tel:${primaryPhone}`}>
              <PhoneIcon size={12} />
              {primaryPhone}
            </a>
          ) : null}
        </div>
        <CopyField label={primaryLabel} value={primaryAccount} />

        {/* 구분선 */}
        {parents.length > 0 ? <div className="my-3 h-px bg-black/10 dark:bg-white/10" /> : null}

        {/* 혼주 리스트: 심플한 행 + 아래 계좌 */}
        {parents.length > 0 ? (
          <div className="space-y-2.5">
            {parents.map((p, idx) => {
              const bank = p.accountValue.split(" ")[0];
              return (
                <div key={idx}>
                  <div className="mb-1 flex items-center justify-between text-xs text-foreground/70">
                    <div className="flex items-center gap-2">
                      <BankBadge bank={bank} />
                      <span className="font-medium">{p.roleLabel}</span>
                    </div>
                    {p.phone ? (
                      <a className="chip" href={`tel:${p.phone}`}>
                        <PhoneIcon size={12} />
                        {p.phone}
                      </a>
                    ) : null}
                  </div>
                  <CopyField value={p.accountValue} />
                </div>
              );
            })}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default AccountCard;


