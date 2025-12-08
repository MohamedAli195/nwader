import ComponentCard from "../../../components/common/ComponentCard";
import ComplaintsTable from "./table";


const Complaints = () => {
    
  return (
    <ComponentCard isNotComplaint={false}  title="complaints">
      <ComplaintsTable />
   
    </ComponentCard>
  )
}

export default Complaints