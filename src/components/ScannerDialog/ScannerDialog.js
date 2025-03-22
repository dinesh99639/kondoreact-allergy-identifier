import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Webcam from 'react-webcam';

import { Button, FloatingActionButton } from '@progress/kendo-react-buttons';
import { Dialog } from '@progress/kendo-react-dialogs';
import { Avatar } from '@progress/kendo-react-layout';

import { qrCodeScannerIcon } from '@progress/kendo-svg-icons';
import { TbCapture, TbFileUpload } from 'react-icons/tb';
import { RxCross2 } from 'react-icons/rx';
import { IoMdCheckmark } from 'react-icons/io';

import './ScannerDialog.css';

const FloatingActionItem = (props) => {
  return (
    <div>
      <span className="k-fab-item-text">{props.item.name}</span>
      <Button onClick={props.item.onClick} className="floatingActionItemButton">
        <Avatar themeColor="info" type="image" className="floatingActionAvatar">
          {props.item.icon}
        </Avatar>
      </Button>
    </div>
  );
};

const ScannerDialog = () => {
  const cameraRef = useRef();
  const fileRef = useRef();

  const navigate = useNavigate();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [image, setImage] = useState('');

  const handleFileChange = (e) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      setImage(e.target.result);
      setIsFileUploadOpen(true);
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const sendDataToScanIngradientsPage = (screenshot = null) => {
    const img = screenshot || image;

    navigate('/dashboard?tab=scan-ingredients', {
      state: {
        image: img,
        type: img.substring(
          img.indexOf('data:image/') + 11,
          img.lastIndexOf(';base64')
        ),
      },
    });
  };

  const capture = () => {
    cameraRef.current.video.pause();
    const screenshot = cameraRef.current.getScreenshot();

    setImage(screenshot);

    return screenshot;
  };

  const confirmCapture = () => {
    const screenshot = capture();
    setIsScannerOpen(false);

    sendDataToScanIngradientsPage(screenshot);
  };

  const confirmFileUpload = () => {
    sendDataToScanIngradientsPage();
    closeFileUpload();
  };

  const closeFileUpload = () => {
    fileRef.current.value = '';
    setIsFileUploadOpen(false);
  };

  return (
    <>
      <FloatingActionButton
        themeColor="info"
        svgIcon={qrCodeScannerIcon}
        item={FloatingActionItem}
        items={[
          {
            name: 'Camera',
            icon: <TbCapture />,
            onClick: () => setIsScannerOpen(true),
          },
          {
            name: 'File Upload',
            icon: <TbFileUpload />,
            onClick: () => fileRef.current.click(),
          },
        ]}
        className='scanner-fab'
      />

      {isScannerOpen && (
        <Dialog className="dialog">
          <Webcam
            ref={cameraRef}
            audio={false}
            height="auto"
            screenshotFormat="image/png"
            width={1280}
            videoConstraints={{
              width: 1280,
              facingMode: 'environment',
            }}
            className="video"
          ></Webcam>
          <div className="actions">
            <Button className="action" onClick={() => setIsScannerOpen(false)}>
              <RxCross2 className="icon" />
            </Button>
            <Button className="action" onClick={capture}>
              <TbCapture className="icon" />
            </Button>
            <Button className="action" onClick={confirmCapture}>
              <IoMdCheckmark className="icon" />
            </Button>
          </div>
        </Dialog>
      )}

      <input ref={fileRef} type="file" onChange={handleFileChange} hidden />

      {isFileUploadOpen && (
        <Dialog className="dialog">
          <img src={image} />

          <div className="actions">
            <Button className="action" onClick={closeFileUpload}>
              <RxCross2 className="icon" />
            </Button>
            <Button className="action" onClick={confirmFileUpload}>
              <IoMdCheckmark className="icon" />
            </Button>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default ScannerDialog;
