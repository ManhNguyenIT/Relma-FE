import React from 'react';

import { Modal } from '../ui/modal';
import FormPersonInfor from '../people-teams/FormPersonInfor';
import { useState } from 'react';
import { MoreIcon } from '../../icons';
import FormMoreInfor from '../people-teams/FormMoreInfor';
import ModalPeopleTeamEdit from './ModalPeopleTeamEdit';
import { useModal } from '../../hooks/useModal';

interface UserCardProps {
  name: string;
  role: string;
}

const UserCard: React.FC<UserCardProps> = ({ name, role }) => {
  return (
    <div className="flex items-center space-x-2 mt-2">
      <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-sm">
        {name.charAt(0).toUpperCase()}
      </div>
      <div className="flex items-center space-x-1">
        <span className="font-semibold text-gray-900">{name}</span>
        <span className="text-gray-400">- {role}</span>
      </div>
    </div>
  );
};

interface ModalPeopleDetailsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalPeopleDetails({ isOpen, onClose }: ModalPeopleDetailsProps) {
  const [activeTab, setActiveTab] = useState('start');
  const {
    isOpen: isModalPeopleTeamEditOpen,
    openModal: openModalPeopleTeamEdit,
    closeModal: closeModalPeopleTeamEdit,
  } = useModal();

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-[900px] m-4">
        <div className="no-scrollbar relative w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14 py-2">
            <UserCard name="Trần Linh" role="Administrator" />
          </div>
          <div className="w-full border-b border-[#F3F3F3]" />

          <form className="flex flex-col">
            <div className="custom-scrollbar h-[500px] overflow-y-auto px-2 pb-3">
              <div className="mt-7 flex flex-col md:gap-4 gap-3">
                <div className="grid grid-cols-1 md:flex items-center justify-between">
                  <div>
                    <div className="flex flex-wrap border-b border-gray-200 w-full">
                      <button
                        type="button"
                        onClick={() => setActiveTab('details')}
                        className={`px-4 py-2 text-sm font-medium ${
                          activeTab === 'details'
                            ? 'text-blue-500 border-b-2 border-blue-500'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Details
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('work-oder')}
                        className={`px-4 py-2 text-sm font-medium ${
                          activeTab === 'work-oder'
                            ? 'text-blue-500 border-b-2 border-blue-500'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Work Order
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:flex items-center md:gap-3 gap-3">
                    <div className="border border-[#E6F6E7] bg-[#E6F6E7] rounded-[5px] p-1 w-full text-center md:w-20 md:h-10">
                      Active
                    </div>
                    <div>
                      <button
                        className="border border-[#949494] bg-white text-[#949494] rounded-[5px] border-solid w-full md:w-20 md:h-10"
                        type="button"
                        onClick={openModalPeopleTeamEdit}
                      >
                        Edit
                      </button>
                    </div>
                    <div className="w-full cursor-pointer">
                      <MoreIcon />
                    </div>
                  </div>
                </div>
                <div className="w-full border-b border-[#F3F3F3]" />
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  {activeTab === 'details' && (
                    <div className="flex flex-col md:gap-3 gap-3 w-full">
                      <FormPersonInfor />
                      <FormMoreInfor />
                    </div>
                  )}

                  {activeTab === 'work-oder' && <div>Content</div>}
                </div>
              </div>

              <div className="w-full flex items-center justify-end gap-2 md:gap-4 md:mt-3 mt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-white px-2 py-2 rounded border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="border border-gray-300 bg-white flex items-center justify-center px-2 py-2 rounded-[4px]"
                >
                  Confirm
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
      <ModalPeopleTeamEdit isOpen={isModalPeopleTeamEditOpen} onClose={closeModalPeopleTeamEdit} />
    </div>
  );
}
