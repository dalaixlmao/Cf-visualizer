import Heading from "./Heading";
import InputBox from "./InputBox";
import Button from "./Button";

export default function Card({
  text,
  subHeading,
  items,
  buttonWidth,
  belowButton,
  navigateTo,
  onClick
}: {
  text: string;
  subHeading: string;
  items: { type: string; setFunction: any }[];
  buttonWidth: string;
  belowButton:string[];
  navigateTo:string;
  onClick: ()=>void;
}) {
  return (
    <div className="bg-white absolute shadow-lg rounded-xl flex flex-col justify-between items-center p-8 md:w-1/3 w-11/12">
      <div className="h-full w-11/12">
        <Heading text={text} subHeading={subHeading} />
        {items.map((elem) => {
          return (
            <InputBox
              type={elem.type === "handle" ? "text" : elem.type}
              name={elem.type}
              setFunction={elem.setFunction}
            />
          );
        })}
        <Button text={text} width={buttonWidth} belowButton={belowButton} navigateTo={navigateTo} onClick={onClick}/>
      </div>
    </div>
  );
}
