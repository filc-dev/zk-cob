import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <Table>
      <colgroup>
        <col style={{ width: "140px" }} />
        <col style={{ width: "auto" }} />
      </colgroup>

      <TableBody>
        {Array(30)
          .fill(-1)
          .map((_, idx) => (
            <TableRow key={idx} className="cursor-pointer">
              <TableCell>
                <Image
                  className="aspect-square object-cover rounded-md"
                  src={`https://picsum.photos/id/${idx}/200/300`}
                  alt="A picture of a cat"
                  width={140}
                  height={140}
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    여수 나래식품 무색소 못난이 명란젓 파지 백명란젓, 300g, 1개
                  </p>
                  <p className="text-lg font-semibold">82.77 ETH</p>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
