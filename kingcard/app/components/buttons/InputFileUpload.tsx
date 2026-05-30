"use client";

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

//Definds types for props
interface UploadProps{
    onFileSelect:(files: FileList | null) => void;
    label?: string; //? means its optional
    accept?: string;
}

export default function InputFileUpload({onFileSelect, label = "Upload Files", accept = "*/*"}: UploadProps) {
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      {label}
      
      <VisuallyHiddenInput
        type="file"
        accept={accept}
        onChange={(event) => onFileSelect(event.target.files)}
        multiple
      />
    </Button>
  );
}
