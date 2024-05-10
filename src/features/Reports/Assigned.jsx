import ReportTable from "../../components/ReportTable";

export default function Assigned() {
  return (
    <div>
      <ReportTable title="Assigned Reports Review" />
      <ReportTable title={"My progress Reports"} />
      <ReportTable title="My past reports" />
    </div>
  );
}
