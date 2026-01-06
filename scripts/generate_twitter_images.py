"""
Generate Twitter-optimized card images for blog articles.
Crops source images to 1200x628 (1.91:1 aspect ratio) for Twitter summary_large_image cards.
"""

from PIL import Image
import os

# Target dimensions for Twitter summary_large_image
TARGET_WIDTH = 1200
TARGET_HEIGHT = 628
TARGET_RATIO = TARGET_WIDTH / TARGET_HEIGHT  # ~1.91

# Source directory
SOURCE_DIR = "blog/assets/blog-images"

# Images to process (source filename -> output filename)
IMAGES = {
    "calm the storm.png": "twitter-calm-the-storm.png",
    "digital overwhelm.png": "twitter-digital-overwhelm.png",
    "digital zen.png": "twitter-digital-zen.png",
    "focused attention.png": "twitter-focused-attention.png",
    "loving kindness.png": "twitter-loving-kindness.png",
    "meditation calendar.png": "twitter-meditation-calendar.png",
    "neural network.png": "twitter-neural-network.png",
    "paradox.png": "twitter-paradox.png",
    "performance.png": "twitter-performance.png",
    "somatic.png": "twitter-somatic.png",
    "Time split.png": "twitter-time-split.png",
}


def center_crop_to_ratio(img: Image.Image, target_ratio: float) -> Image.Image:
    """
    Center-crop an image to match the target aspect ratio.
    """
    width, height = img.size
    current_ratio = width / height

    if current_ratio > target_ratio:
        # Image is wider than target - crop width
        new_width = int(height * target_ratio)
        left = (width - new_width) // 2
        return img.crop((left, 0, left + new_width, height))
    elif current_ratio < target_ratio:
        # Image is taller than target - crop height
        new_height = int(width / target_ratio)
        top = (height - new_height) // 2
        return img.crop((0, top, width, top + new_height))
    else:
        # Already correct ratio
        return img


def process_image(source_path: str, output_path: str) -> None:
    """
    Process a single image: crop to ratio and resize to target dimensions.
    """
    print(f"Processing: {source_path}")
    
    with Image.open(source_path) as img:
        # Convert to RGB if necessary (handles RGBA, P mode, etc.)
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
        
        original_size = img.size
        print(f"  Original size: {original_size[0]}x{original_size[1]}")
        
        # Center crop to target ratio
        cropped = center_crop_to_ratio(img, TARGET_RATIO)
        print(f"  After crop: {cropped.size[0]}x{cropped.size[1]}")
        
        # Resize to target dimensions
        resized = cropped.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
        print(f"  Final size: {resized.size[0]}x{resized.size[1]}")
        
        # Save with optimization
        resized.save(output_path, "PNG", optimize=True)
        print(f"  Saved: {output_path}")


def main():
    """
    Process all blog images to create Twitter-optimized versions.
    """
    print(f"Generating Twitter card images ({TARGET_WIDTH}x{TARGET_HEIGHT})")
    print("=" * 60)
    
    processed = 0
    errors = []
    
    for source_name, output_name in IMAGES.items():
        source_path = os.path.join(SOURCE_DIR, source_name)
        output_path = os.path.join(SOURCE_DIR, output_name)
        
        if not os.path.exists(source_path):
            errors.append(f"Source not found: {source_path}")
            continue
        
        try:
            process_image(source_path, output_path)
            processed += 1
        except Exception as e:
            errors.append(f"Error processing {source_name}: {e}")
        
        print()
    
    print("=" * 60)
    print(f"Processed: {processed}/{len(IMAGES)} images")
    
    if errors:
        print("\nErrors:")
        for error in errors:
            print(f"  - {error}")


if __name__ == "__main__":
    main()

