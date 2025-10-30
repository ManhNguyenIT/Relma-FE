import { MoreIcon } from '../icons';
import { useState } from 'react';
import { useModal } from '../hooks/useModal';
import WorkOrderTask from '../components/workorder/work-order-task/WorkOrderTask';
import ModalScanQr from '../components/modal/ModalScanQr';
import { ScanIcon } from '../icons';
import ModalQr from '../components/modal/ModalQr';
import PeopleTeamTable from '../components/people-teams/PeopleTeamTable';

import Checkbox from '../components/form/input/Checkbox';
import ModalAddTeam from '../components/modal/ModalAddTeam';
import ModalDeactive from '../components/modal/ModalDeactive';
import ModalDeletePerson from '../components/modal/ModalDeletePerson';

import AccountTypeButton from '../components/people-teams/AccountTypeButton';
export default function PeopleAndTeam() {
  const [showMenu, setShowMenu] = useState(false);

  const {
    isOpen: isModalDeactiveOpen,
    openModal: openModalDeactive,
    closeModal: closeModalDeactive,
  } = useModal();

  const {
    isOpen: isModalDeletePersonOpen,
    openModal: openModalDeletePerson,
    closeModal: closeModalDeletePerson,
  } = useModal();

  const { isOpen: isModalQrOpen, openModal: openModalQr, closeModal: closeModalQr } = useModal();
  const {
    isOpen: isModalAddTeamOpen,
    openModal: openModalAddTeam,
    closeModal: closeModalAddTeam,
  } = useModal();
  const {
    isOpen: isModalScanQrOpen,
    openModal: openModalScanQr,
    closeModal: closeModalScanQr,
  } = useModal();
  const [includeDeactivated, setIncludeDeactivated] = useState(false);

  const [activeTab, setActiveTab] = useState('People');
  return (
    <div className="w-full flex flex-col md:gap-4 gap-3">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center md:gap-3 gap-3">
          <div>
            {' '}
            <button
              type="button"
              onClick={() => setActiveTab('people')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'people'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              People
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('teams')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'teams'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Teams
            </button>
          </div>
        </div>

        <div className="flex items-center md:gap-3 gap-3">
          {' '}
          <button
            className="border border-[#0C6FF9] bg-[#0C6FF9] text-white flex items-center justify-center px-2 py-2 rounded-[4px]"
            type="button"
            onClick={openModalAddTeam}
          >
            Add Team
          </button>
          <MoreIcon onClick={() => setShowMenu(!showMenu)} className="cursor-pointer" />
          {showMenu && (
            <div className="absolute right-4 top-32 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button
                  className="flex items-center px-4 py-2 text-sm text-pink-600 hover:bg-gray-100 w-full text-left"
                  type="button"
                  onClick={openModalDeactive}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  Deactivate
                </button>
                <button
                  className="flex items-center px-4 py-2 text-sm text-pink-600 hover:bg-gray-100 w-full text-left"
                  type="button"
                  onClick={openModalDeletePerson}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          )}
          <div className="cursor-pointer">
            <ScanIcon className="w-5 h-5" onClick={openModalScanQr} />
          </div>
        </div>
      </div>
      <div className="w-full border-b border-[#F3F3F3]" />
      <div className="mt-4 p-4 ">
        {activeTab === 'people' && (
          <div className="flex flex-col md:gap-3 gap-3">
            <WorkOrderTask />
            <div className=" grid grid-cols-1 md:flex items-center md:gap-4 gap-4">
              <AccountTypeButton />
              <Checkbox checked={includeDeactivated} onChange={setIncludeDeactivated} />
              <p>Include Deactivated</p>
              <p className="cursor-pointer font-medium text-[#007FE6]">Reset</p>
            </div>

            <PeopleTeamTable />
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="flex flex-col items-center justify-center gap-2 md:gap-6 w-full min-h-[60vh]">
            <div className="text-[20px] font-semibold">No Teams</div>
            <div className="flex flex-col items-center gap-2 md:gap-5">
              <div className="text-[#949494C9]">You can begin by creating or importing teams.</div>
              <div className="flex items-center gap-2 md:gap-3">
                <div>
                  {' '}
                  <button
                    type="button"
                    className="border border-gray-300 bg-white flex items-center justify-center px-2 py-2 rounded-[4px]"
                  >
                    Create Team
                  </button>
                </div>
                <div>
                  {' '}
                  <button
                    type="button"
                    className="border border-gray-300 bg-white flex items-center justify-center px-2 py-2 rounded-[4px]"
                  >
                    Import Teams
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ModalQr isOpen={isModalQrOpen} onClose={closeModalQr} />
      <ModalAddTeam isOpen={isModalAddTeamOpen} onClose={closeModalAddTeam} />
      <ModalDeactive isOpen={isModalDeactiveOpen} onClose={closeModalDeactive} />
      <ModalDeletePerson isOpen={isModalDeletePersonOpen} onClose={closeModalDeletePerson} />
      <ModalScanQr
        isOpen={isModalScanQrOpen}
        onClose={closeModalScanQr}
        onScanSuccess={(result) => {
          console.log('QR Scan result:', result);
          closeModalScanQr();
          // Mở ModalQr sau khi quét QR thành công
          setTimeout(() => {
            openModalQr();
          }, 100);
        }}
      />
    </div>
  );
}
