export interface LinkItem {
  id: number;
  title: string;
  link?: string;
  icon: any;
  sublinks?: any[];
}

export interface ModalProps {
  data: any;
  onModalClose?: () => void;
}
