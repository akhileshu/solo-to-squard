import { Modal } from "@/components/ui/modal";

export function ConfirmDeleteVideoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ConfirmDeleteVideo Modal">
      <p>Modal content for ConfirmDeleteVideo</p>
    </Modal>
  );
}