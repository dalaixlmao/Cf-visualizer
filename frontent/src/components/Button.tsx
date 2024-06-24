export default function Button({
  text,
  width,
  belowButton,
  navigateTo,
  onClick,
}: {
  text: string;
  width: string;
  belowButton: string[];
  navigateTo:string;
  onClick:()=>void
}) {
  return (
    <div>
      <button
        className={`w-${width} bg-black text-white font-semibold p-2 rounded-md mt-5`}
        onClick={onClick}
      >
        {text}
      </button>
      <div className="text-center p-1 font-medium text-xs">
        {belowButton[0]}&nbsp;
        <a className="underline" href={navigateTo}>{belowButton[1]}</a>
      </div>
    </div>
  );
}
