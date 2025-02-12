const LimitingLine = ({ isServices }) => {
    return (
      <div
        className={`border-b-2 ${
          isServices ? "border-white" : "border-black"
        } w-[56px] mx-auto mt-9 mb-9`}
      ></div>
    );
  };
  
  export default LimitingLine;
  