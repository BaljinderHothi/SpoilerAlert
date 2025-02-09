import React, { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useAnimation,
  useTransform,
  PanInfo,
} from "framer-motion";

const IMGS: string[] = [
  "https://media.istockphoto.com/id/1457889029/photo/group-of-food-with-high-content-of-dietary-fiber-arranged-side-by-side.jpg?s=612x612&w=0&k=20&c=SEyObHsbBsrd1XZlgEg389VT86BMFKZKfKReKyVPAk4=",
  "https://img.freepik.com/free-photo/stew-chicken-with-vegetables-mushrooms_155003-434.jpg",
  "https://i.etsystatic.com/22761104/r/il/3e64e7/2552016467/il_fullxfull.2552016467_cwev.jpg",
  "https://media.istockphoto.com/id/1425232352/photo/expired-organic-bio-waste-mix-vegetables-and-fruits-in-a-huge-container-in-a-rubbish-bin-heap.jpg?s=612x612&w=0&k=20&c=_hIv18ePoswfw6BTJK9j7JMC4mhgXU-GX8rpIEbIJ5s=",
  "https://6850012.fs1.hubspotusercontent-na1.net/hub/6850012/hubfs/00_Content%20Marketing/Blogs/PLM%20and%20Compliance/Feature%20Images/Food_waste_by_Kmpzzz-2325939307.jpg?width=1908&height=1046&name=Food_waste_by_Kmpzzz-2325939307.jpg",
  "https://umaine.edu/sustainability/wp-content/uploads/sites/162/2021/04/Treasure_trove_of_wasted_food_sm2.jpg",
  "https://shapiroe.com/wp-content/uploads/2023/05/food-recall-770x428.jpg",
  "https://pangovet.com/wp-content/uploads/2024/10/PangoVet_Cat-Food-Recall-Featured-Image_v1_Oct-1-2024.jpg",
  "data:image/jpeg;base64,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",
  "https://townsquare.media/site/41/files/2025/02/attachment-Untitled-design-2025-02-03T132459.529.jpg?w=780&q=75"];

interface RollingGalleryProps {
  autoplay?: boolean;
  pauseOnHover?: boolean;
  images?: string[];
}

const RollingGallery: React.FC<RollingGalleryProps> = ({
  autoplay = false,
  pauseOnHover = false,
  images = [],
}) => {
  // Use default images if none are provided
  const galleryImages = images.length > 0 ? images : IMGS;
  const [isAnimating, setIsAnimating] = useState(false);
  const [isScreenSizeSm, setIsScreenSizeSm] = useState<boolean>(
    window.innerWidth <= 640
  );
  useEffect(() => {
    const handleResize = () => setIsScreenSizeSm(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 3D geometry calculations
  const cylinderWidth: number = window.innerWidth;
  const faceCount: number = galleryImages.length;
  const faceWidth: number = (cylinderWidth / faceCount) * 2;
  const radius: number = cylinderWidth / (2 * Math.PI);

  // Framer Motion values and controls
  const dragFactor: number = 0.005;
  const rotation = useMotionValue(0);
  const controls = useAnimation();

  // Create a 3D transform based on the rotation motion value
  const transform = useTransform(
    rotation,
    (val: number) => `rotate3d(0,1,0,${val}deg)`
  );

  const startInfiniteSpin = (startAngle: number) => {
    controls.start({
      rotateY: [startAngle, startAngle - 360],
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  useEffect(() => {
    if (autoplay && !isAnimating) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
      setIsAnimating(true); // Mark animation as running
    } else if (!autoplay) {
      controls.stop();
      setIsAnimating(false); // Mark animation as stopped
    }
  }, [autoplay]);
  
  

  const handleUpdate = (latest: any) => {
    if (typeof latest.rotateY === "number") {
      rotation.set(latest.rotateY);
    }
  };

  const handleDrag = (_: any, info: PanInfo): void => {
    controls.stop();
    rotation.set(rotation.get() + info.offset.x * dragFactor);
  };

  const handleDragEnd = (_: any, info: PanInfo): void => {
    const finalAngle = rotation.get() + info.velocity.x * dragFactor;
  
    // Ensure smooth transition to autoplay
    if (autoplay) {
      controls.start({
        rotateY: [finalAngle, finalAngle - 360],
        transition: {
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        },
      });
    } else {
      rotation.set(finalAngle); // If autoplay is off, just set the angle
    }
  };
  

  const handleMouseEnter = (): void => {
    if (autoplay && pauseOnHover) {
      controls.stop();
    }
  };
  
  const handleMouseLeave = (): void => {
    if (autoplay && pauseOnHover) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    }
  };
  

  return (
    <div className="relative h-[200px] w-full overflow-hidden">
      <div className="flex h-full items-center justify-center [perspective:1000px] [transform-style:preserve-3d]">
        <motion.div
          drag="x"
          dragElastic={0}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          animate={controls}
          onUpdate={handleUpdate}
          style={{
            transform: transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
          className="flex min-h-[200px] cursor-grab items-center justify-center [transform-style:preserve-3d]"
        >
          {galleryImages.map((url, i) => (
            <div
              key={i}
              className="group absolute flex h-fit items-center justify-center p-[8%] [backface-visibility:hidden] md:p-[6%]"
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${(360 / faceCount) * i}deg) translateZ(${radius}px)`,
                willChange: "transform",
              }}
            >
              <img
                src={url}
                alt="gallery"
                className="pointer-events-none h-[120px] rounded-[15px] border-[3px] border-[#FF5A5F] object-cover transition-transform duration-300 ease-out group-hover:scale-105"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default RollingGallery;
