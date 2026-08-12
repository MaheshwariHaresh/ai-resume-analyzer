const Stat = ({ icon, title, value }) => (
  <div className="flex justify-between items-center py-3 border-b last:border-none">
    <div className="flex items-center gap-3">
      <div className="text-blue-600">{icon}</div>

      <span>{title}</span>
    </div>

    <span className="font-bold">{value}</span>
  </div>
);

export default Stat;
