import React from 'react';

import { useGetModalLoginMethods } from 'hooks';

import { LoginButton } from '../../LoginButton/LoginButton';
import { WalletConnectLoginContainer } from '../WalletConnectLoginContainer';
import { WalletConnectLoginButtonPropsType } from './types';

export const WalletConnectLoginButton = ({
  buttonClassName = 'dapp-wallet-connect-login-button',
  callbackRoute,
  children,
  className = 'dapp-wallet-connect-login',
  customSpinnerComponent,
  'data-testid': dataTestId,
  disabled,
  hideButtonWhenModalOpens = false,
  innerWalletConnectComponentsClasses,
  isWalletConnectV2 = true,
  lead = 'Scan the QR code using the xPortal App',
  loginButtonText = 'xPortal App',
  logoutRoute,
  modalClassName,
  nativeAuth,
  onLoginRedirect,
  onContentHide,
  onContentShow,
  onModalCloses,
  onModalOpens,
  showScamPhishingAlert,
  title = 'Login with the xPortal App',
  token,
  wrapContentInsideModal = true
}: WalletConnectLoginButtonPropsType) => {
  const {
    disabledConnectButton,
    handleCloseModal,
    handleOpenModal,
    shouldRenderButton,
    showContent,
    showModal
  } = useGetModalLoginMethods({
    hideButtonWhenModalOpens,
    onContentHide,
    onContentShow,
    onModalCloses,
    onModalOpens,
    token,
    wrapContentInsideModal
  });

  return (
    <>
      {shouldRenderButton && (
        <LoginButton
          btnClassName={buttonClassName}
          className={className}
          data-testid={dataTestId}
          disabled={disabled || disabledConnectButton}
          onLogin={handleOpenModal}
          text="CLICK ME!"
        >
          {children}
        </LoginButton>
      )}
    </>
  );
};