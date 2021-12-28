import React, { useRef, useState } from 'react';
import {
  faCheck,
  faHourglass,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Toast } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { signedTransactionsSelector } from 'redux/selectors';
import IconState from 'UI/IconState';
import Progress from 'UI/Progress';

import TxDetails from 'UI/TxDetails';

import { getGeneratedClasses, isBatchTransactionPending } from 'utils';
import { TransactionToastPropsType } from './types';

export const TransactionToast = ({
  endTime,
  toastId,
  startTime,
  title = '',
  shouldRenderDefaultCss = true,
  className = 'transaction-toast',
  errorMessage = 'Transaction failed',
  successMessage = 'Transaction successful',
  processingMessage = 'Processing transaction'
}: TransactionToastPropsType) => {
  const ref = useRef(null);
  const [shouldRender, setShouldRender] = useState(true);
  const generatedClasses = getGeneratedClasses(
    className,
    shouldRenderDefaultCss,
    {
      toastFooter: 'mb-0 text-break',
      details: 'media-body flex-grow-1',
      toastContainer: 'w-100 media p-2',
      wrapper: 'toast-visible clickable',
      toastHeader: 'd-flex justify-content-between mb-1',
      iconContainer: 'align-self-center ml-2 mr-2 pr-1',
      title: 'm-0 font-weight-normal text-nowrap text-truncate',
      closeButton: 'close d-flex side-action align-items-center mx-2 outline-0'
    }
  );

  const signedTransactions = useSelector(signedTransactionsSelector);

  const currentTx: any = signedTransactions[toastId];

  const { transactions, status } = currentTx;

  const progress = { startTime, endTime };

  const successToastData = {
    id: toastId,
    icon: faCheck,
    expires: 30000,
    hasCloseButton: true,
    title: successMessage,
    iconClassName: 'bg-success'
  };

  const pendingToastData = {
    id: toastId,
    expires: false,
    icon: faHourglass,
    hasCloseButton: false,
    title: processingMessage,
    iconClassName: 'bg-warning'
  };

  const failedToastData = {
    id: toastId,
    icon: faTimes,
    title: errorMessage,
    hasCloseButton: true,
    iconClassName: 'bg-danger'
  };

  const isPending = isBatchTransactionPending(status);

  const toatsOptionsData = {
    signed: pendingToastData,
    cancelled: failedToastData,
    successful: successToastData,
    sent: pendingToastData,
    failed: failedToastData,
    timedOut: failedToastData
  };

  const toastDataState = toatsOptionsData[status];

  const handleDeleteToast = () => {
    setShouldRender(false);
  };

  if (!shouldRender) {
    return null;
  }

  return (
    <Toast ref={ref} className={generatedClasses.wrapper} key={toastId}>
      <Progress
        key={toastId}
        id={toastId}
        progress={progress}
        done={!isPending}
      >
        <div className={generatedClasses.toastContainer}>
          <div className={generatedClasses.iconContainer}>
            <IconState
              iconSize='2x'
              icon={toastDataState.icon}
              className={toastDataState.iconClassName}
            />
          </div>
          <div className={generatedClasses.details} style={{ minWidth: 0 }}>
            <div className={generatedClasses.toastHeader}>
              <h5 className={generatedClasses.title}>{toastDataState.title}</h5>
              {!isPending && (
                <button
                  type='button'
                  className={generatedClasses.closeButton}
                  onClick={handleDeleteToast}
                >
                  <FontAwesomeIcon icon={faTimes} size='xs' />
                </button>
              )}
            </div>
            <div className={generatedClasses.toastFooter}>
              <TxDetails transactions={transactions} title={title} />
            </div>
          </div>
        </div>
      </Progress>
    </Toast>
  );
};

export default TransactionToast;