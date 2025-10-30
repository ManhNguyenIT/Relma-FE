import { useRef } from 'react';
import WorkOrderTask from '../components/workorder/work-order-task/WorkOrderTask';
import FilterButton from '../components/workorder/work-order-button/FilterButton';
import RequestHeader from '../components/request/RequestHeader';
import LocationButton from '../components/workorder/work-order-button/LocationButton';
import RequestTable from '../components/request/RequestTable';

export default function Requests() {
  const requestTableRef = useRef<{ refresh: () => void }>(null);

  const handleRequestCreated = () => {
    if (requestTableRef.current) {
      requestTableRef.current.refresh();
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div>
        <RequestHeader onRequestCreated={handleRequestCreated} />
      </div>
      <div>
        <WorkOrderTask />
      </div>
      <div className=" grid grid-cols-1 md:flex items-center md:gap-4 gap-4">
        <FilterButton />

        <LocationButton />

        <p className="cursor-pointer font-medium text-[#007FE6]">Reset</p>
      </div>
      <div>
        <RequestTable ref={requestTableRef} />
      </div>
    </div>
  );
}
