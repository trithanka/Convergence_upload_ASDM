// import { ReactNode } from "react";
// import { X } from "lucide-react";

// interface ModalProps {
//   title: string;
//   children: ReactNode;
//   footer?: ReactNode;
//   isOpen: boolean;
//   onClose: () => void;
// }

// const Modal: React.FC<ModalProps> = ({ title, children, footer, isOpen, onClose }) => {
//   if (!isOpen) return null;

//   return (
//   <div className="modal fixed inset-0 z-10 flex items-center justify-center" role="dialog" aria-modal="true" id="melaStatusModal">
//   <div className="fixed inset-0 bg-black/75 transition-opacity p-4" aria-hidden="true"></div>

//   <div className="relative z-20 w-full max-w-2xl mx-auto p-4">
//     <div className="max-h-[calc(100vh-2rem)] overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all flex flex-col gap-6 p-6">
//       {/* modal title */}
//       <div className="">
//         <h3 className="text-base font-semibold text-gray-900" id="modal-title">Change Job Mela Status</h3>
//       </div>
//       {/* modal body */}
//       <div className="flex-grow overflow-y-auto">
//         <div className="h-[100rem] bg-gray-100 my-4">
//           <p className="text-sm text-gray-500">
//             Are you sure you want to <span id="login-action-word">deactivate</span> this Job Mela? It will
//             <span id="login-action-detail"> no longer be visible or accessible to participants</span>.
//           </p>
//         </div>
//       </div>
//       {/* modal buttons */}
//       <div className="">
//         <div className="flex justify-end gap-2">
//           <button className="bg-black text-white text-xs px-4 py-2.5 rounded-full hover:bg-black/80">Deactivate</button>
//           <button className="text-xs px-4 py-2.5 rounded-full bg-white ring-1 ring-gray-300 hover:bg-gray-50">Cancel</button>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
//   );
// };

// export default Modal;
