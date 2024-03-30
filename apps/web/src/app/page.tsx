import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-cols-2 gap-4 gap-y-8 py-4">
      {Array(30)
        .fill(-1)
        .map((_, idx) => (
          <Link href={`/products/${idx}`} key={idx}>
            <div className="w-full flex flex-col gap-2 cursor-pointer">
              <AspectRatio ratio={4 / 3}>
                <Image
                  className="aspect-square object-cover rounded-md border"
                  src={`https://picsum.photos/id/${idx}/200/300`}
                  alt="A picture of a cat"
                  fill
                />
              </AspectRatio>
              <div className="flex flex-col gap-1">
                <p className="text-xs line-clamp-2 text-ellipsis text-muted-foreground">
                  여수 나래식품 무색소 못난이 명란젓 파지 백명란젓, 300g, 1개
                </p>
                <p className="text-sm font-medium">82.77 MINA</p>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}
