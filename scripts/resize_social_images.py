"""
Resize feature graphic for Twitter Cards and Open Graph images.

Requirements:
- Twitter Card (Summary with Large Image): 1200 x 628 (1.91:1 ratio)
- Open Graph: 1200 x 630 (1.91:1 ratio)

Both are very similar, but we'll create exact sizes for each.
"""

from PIL import Image
import os

# Paths
SOURCE_IMAGE = r"C:\EXPO\whitespace-landing\src\assets\feature small.png"
OUTPUT_DIR = r"C:\EXPO\whitespace-landing\src\assets"

# Target sizes
TWITTER_SIZE = (1200, 628)  # Twitter Card with Large Image
OG_SIZE = (1200, 630)       # Open Graph recommended size

def resize_with_crop_or_pad(img, target_size, bg_color=(13, 13, 15)):
    """
    Resize image to target size, maintaining aspect ratio.
    Will crop or add padding as needed to achieve exact dimensions.
    """
    target_w, target_h = target_size
    target_ratio = target_w / target_h
    
    img_w, img_h = img.size
    img_ratio = img_w / img_h
    
    if abs(img_ratio - target_ratio) < 0.01:
        # Aspect ratios are close enough, just resize
        return img.resize(target_size, Image.Resampling.LANCZOS)
    
    if img_ratio > target_ratio:
        # Image is wider - fit to height, crop width
        new_h = target_h
        new_w = int(img_w * (target_h / img_h))
        resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        # Center crop
        left = (new_w - target_w) // 2
        return resized.crop((left, 0, left + target_w, target_h))
    else:
        # Image is taller - fit to width, crop height
        new_w = target_w
        new_h = int(img_h * (target_w / img_w))
        resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        # Center crop
        top = (new_h - target_h) // 2
        return resized.crop((0, top, target_w, top + target_h))

def main():
    # Check source exists
    if not os.path.exists(SOURCE_IMAGE):
        print(f"Error: Source image not found: {SOURCE_IMAGE}")
        return
    
    # Load source image
    print(f"Loading: {SOURCE_IMAGE}")
    img = Image.open(SOURCE_IMAGE)
    print(f"Source size: {img.size[0]} x {img.size[1]}")
    print(f"Source ratio: {img.size[0] / img.size[1]:.3f}")
    
    # Convert to RGB if needed (for PNG with transparency)
    if img.mode in ('RGBA', 'LA', 'P'):
        # Create background
        bg = Image.new('RGB', img.size, (13, 13, 15))  # Dark background matching the image
        if img.mode == 'P':
            img = img.convert('RGBA')
        bg.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
        img = bg
    elif img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Create Twitter Card image
    print(f"\nCreating Twitter Card: {TWITTER_SIZE[0]} x {TWITTER_SIZE[1]}")
    twitter_img = resize_with_crop_or_pad(img, TWITTER_SIZE)
    twitter_path = os.path.join(OUTPUT_DIR, "twitter-card.png")
    twitter_img.save(twitter_path, "PNG", optimize=True)
    print(f"Saved: {twitter_path}")
    
    # Create Open Graph image
    print(f"\nCreating Open Graph: {OG_SIZE[0]} x {OG_SIZE[1]}")
    og_img = resize_with_crop_or_pad(img, OG_SIZE)
    og_path = os.path.join(OUTPUT_DIR, "og-image.png")
    og_img.save(og_path, "PNG", optimize=True)
    print(f"Saved: {og_path}")
    
    # Print comparison
    print("\n" + "="*50)
    print("Summary:")
    print("="*50)
    print(f"Source:       {img.size[0]} x {img.size[1]} (ratio: {img.size[0]/img.size[1]:.3f})")
    print(f"Twitter Card: {TWITTER_SIZE[0]} x {TWITTER_SIZE[1]} (ratio: {TWITTER_SIZE[0]/TWITTER_SIZE[1]:.3f})")
    print(f"Open Graph:   {OG_SIZE[0]} x {OG_SIZE[1]} (ratio: {OG_SIZE[0]/OG_SIZE[1]:.3f})")
    print("\nBoth images saved successfully!")

if __name__ == "__main__":
    main()
