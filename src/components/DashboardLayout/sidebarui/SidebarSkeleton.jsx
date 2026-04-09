import { SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

function SidebarSkeleton() {
  const subMenuWidths = ["w-1/3", "w-2/3", "w-1/2", "w-3/4"];
  return (
    <>
      <SidebarContent>
        <div className="space-y-2 p-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-2 px-2 py-2 ">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-4 flex-1" />
              </div>
              <div className="ml-12 space-y-2 ">
                {Array.from({ length: 2 + (i % 2) }).map((_, j) => (
                  <Skeleton
                    key={j}
                    className={` h-3 ${subMenuWidths[(i + j) % subMenuWidths.length]}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </SidebarContent>
      <SidebarFooter className={"border-t"}>
        <div className="flex items-center gap-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}

export default SidebarSkeleton;
