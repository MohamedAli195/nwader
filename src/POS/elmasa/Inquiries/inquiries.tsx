import ComponentCard from "../../../components/common/ComponentCard";
import InquiriesTable from "./table";


const Inquiries = () => {
    
  return (
    <ComponentCard  isNotComplaint={false} title="inquiries">
      <InquiriesTable />
   
    </ComponentCard>
  )
}

export default Inquiries