import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';

function ImageGallery({ items }) {
  return (
    <>
      <ul className="ImageGallery">
        {items.map(item => (
          <ImageGalleryItem key={item.id} item={item} />
        ))}
      </ul>
    </>
  );
}

export default ImageGallery;
