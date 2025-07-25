const Card: React.FC<{ children: React.ReactNode; title?: string }> = ({
  children,
  title,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 m-8 w-full max-w-full sm:max-w-full md:max-w-full lg:max-w-full xl:max-w-full 2xl:max-w-full">
      {title && <h2 className="text-2xl font-bold mb-8">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;
