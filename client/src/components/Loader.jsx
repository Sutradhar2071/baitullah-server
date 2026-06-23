const Loader = ({ label = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-10 h-10 border-4 border-sage border-t-primary rounded-full animate-spin" />
      <p className="text-sm text-ink/60">{label}</p>
    </div>
  );
};

export default Loader;
