import { BottomCta } from "@/components/bottom-cta";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

const Product = () => {
  return (
    <div className="w-full py-4">
      <AspectRatio
        ratio={6 / 4}
        className="bg-muted rounded-md overflow-hidden"
      >
        <Image fill src={`https://picsum.photos/id/1000/800/300`} alt={""} />
      </AspectRatio>
      <div className="flex flex-col gap-1 py-6 border-b">
        <h1 className="text-sm font-medium text-muted-foreground">
          Product Name
        </h1>
        <p className="text-xl font-semibold">39 ETH</p>
        <div className="flex flex-col gap-2 mt-2">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-primary">1</span>/4 Peoples
          </p>
          <Progress value={1} max={4} />
        </div>
      </div>
      <p className="py-8">
        상세 내용 [채용 일정] - 지원 기간 : 2024.03.22(금) ~ 04.21(일) - 합격자
        발표 : 2024.05.02(목) *개별알림 [지원 자격] - 해외여행 결격 사유가 없는
        내국인 - 애니팡4 스테이지 10 이상 플레이 한 유저 [안내 사항] - 알바 장소
        : 위메이드플레이 본사 - 알바 일자 : 2024.05.16(목) - 알바 시간 : 11am ~
        5pm(출근시간 추후 안내) - 애니팡4 4주년 테스터로 선발된 알바생 한 분은
        1시간 게임하고 알바비 1,000만 원을 계좌로 지급해 드려요. - 본 공고는
        단기 근로 계약으로 근로계약서를 체결해야 돼요. - 선발된 알바생 한 분은
        안내한 체험일에 꼭 참석하셔야 하며, 알바 당일 불참 시 채용이 취소될 수
        있어요. - 테스트 과정은 사진 또는 영상으로 촬영되어 사전에 촬영 동의가
        필요해요. - 선발된 알바생은 알바 당일에 신분증 및 통장사본을 꼭 지참해야
        돼요! [참여 방법] - 하단의 [지원하기] 버튼을 누르고 알바 프로필을 등록한
        뒤 지원해 주세요 - 지원서 작성하기: 지원에 대한 동기를 작성해 주세요. 꼭
        애니팡4 스테이지 10 이상 플레이 하셔야 지원 가능하니 이 부분 유의해
        주세요!
      </p>
      <BottomCta>
        <Button size="xl" className="w-full">
          Buy
        </Button>
      </BottomCta>
    </div>
  );
};

export default Product;
