import Image, { type ImageProps } from "next/image";

const CLOUDINARY_HOST = "res.cloudinary.com";
const CLOUDINARY_UPLOAD_SEGMENT = "/upload/";
const CLOUDINARY_AUTO_OPTIMIZE = "f_auto,q_auto";

function optimizeCloudinaryUrl(src: string): string {
  if (!src.includes(CLOUDINARY_HOST) || !src.includes(CLOUDINARY_UPLOAD_SEGMENT)) {
    return src;
  }

  // Skip if the URL already contains auto format/quality in its transformation chain.
  if (src.includes("/upload/f_auto") || src.includes("/upload/q_auto")) {
    return src;
  }

  return src.replace(CLOUDINARY_UPLOAD_SEGMENT, `${CLOUDINARY_UPLOAD_SEGMENT}${CLOUDINARY_AUTO_OPTIMIZE}/`);
}

type PhotoProps = Omit<ImageProps, "src"> & {
  src: string;
};

export function Photo({
  src,
  alt,
  sizes,
  priority,
  loading,
  fetchPriority,
  quality,
  ...props
}: PhotoProps) {
  const resolvedSrc = optimizeCloudinaryUrl(src);
  const resolvedLoading = loading ?? (priority ? "eager" : "lazy");
  const resolvedFetchPriority = fetchPriority ?? (priority ? "high" : undefined);
  const resolvedSizes = sizes ?? "100vw";
  const resolvedQuality = quality ?? (priority ? 80 : 75);

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      sizes={resolvedSizes}
      priority={priority}
      loading={resolvedLoading}
      fetchPriority={resolvedFetchPriority}
      quality={resolvedQuality}
      decoding="async"
      {...props}
    />
  );
}

