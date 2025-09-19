import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Prediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings?: Array<{
      offset: number;
      length: number;
    }>;
  };
  terms?: Array<{
    offset: number;
    value: string;
  }>;
  types?: string[];
}

export interface Documento {
  id: string;
  conductor_id: string;
  categoria: string;
  nombre_original: string;
  nombre_archivo: string;
  ruta_archivo: string;
  s3_key: string;
  filename: string;
  mimetype: string;
  size: number;
  fecha_vigencia: string;
  estado: string;
  upload_date: string;
  metadata: {
    size: number;
    bucket: string;
    s3Location: string;
    processedAt: string;
    originalPath: string;
    fileExtension: string;
    uploadSession: string;
  };
  createdAt: string;
  updatedAt: string;
}
