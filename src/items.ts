export type MachineItem = {
  label: string;
  note: string;
  color: string;
};

export const items: MachineItem[] = [
  { label: "今日は返信しない券", note: "既読のまま、夕方まで寝かせてよい。", color: "#ff6b6b" },
  { label: "やや早すぎた拍手", note: "まだ終わっていないが、気持ちは伝わった。", color: "#f7b731" },
  { label: "小さな言い訳", note: "電波が、たぶん、森に吸われました。", color: "#7ed6df" },
  { label: "知らない人の応援", note: "それ、かなりいいと思います。", color: "#a29bfe" },
  { label: "片方だけの靴下", note: "もう片方は冒険に出ました。", color: "#55efc4" },
  { label: "押し間違えたボタン", note: "でも今日の主役はこれでした。", color: "#fd79a8" }
];

export function pickItem(index: number) {
  return items[index % items.length];
}
