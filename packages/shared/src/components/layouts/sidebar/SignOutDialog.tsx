import { ConfirmDialog } from './ConfirmDialog';

interface SignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void | Promise<void>;
}

export function SignOutDialog({ open, onOpenChange, onConfirm }: SignOutDialogProps) {
  const handleSignOut = () => {
    Promise.resolve(onConfirm?.()).finally(() => onOpenChange(false));
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Sign out"
      desc="Are you sure you want to sign out? You will need to sign in again to access your account."
      confirmText="Sign out"
      destructive
      handleConfirm={handleSignOut}
      className="sm:max-w-sm"
    />
  );
}
