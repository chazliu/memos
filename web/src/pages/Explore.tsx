import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import Empty from "@/components/Empty";
import Memo from "@/components/Memo";
import MemoFilter from "@/components/MemoFilter";
import MobileHeader from "@/components/MobileHeader";
import { DEFAULT_MEMO_LIMIT } from "@/helpers/consts";
import { useFilterStore, useMemoStore } from "@/store/module";
import { useTranslate } from "@/utils/i18n";

const Explore = () => {
  const t = useTranslate();
  const filterStore = useFilterStore();
  const memoStore = useMemoStore();
  const filter = filterStore.state;
  const { loadingStatus, memos } = memoStore.state;
  const { text: textQuery } = filter;
  const fetchMoreRef = useRef<HTMLSpanElement>(null);

  const fetchedMemos = memos.filter((memo) => {
    if (textQuery && !memo.content.toLowerCase().includes(textQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const sortedMemos = fetchedMemos
    .filter((m) => m.rowStatus === "NORMAL" && m.visibility !== "PRIVATE")
    .sort((mi, mj) => mj.displayTs - mi.displayTs);

  useEffect(() => {
    memoStore.setLoadingStatus("incomplete");
  }, []);

  useEffect(() => {
    if (!fetchMoreRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      handleFetchMoreClick();
    });
    observer.observe(fetchMoreRef.current);

    return () => observer.disconnect();
  }, [loadingStatus]);

  const handleFetchMoreClick = async () => {
    try {
      await memoStore.fetchAllMemos(DEFAULT_MEMO_LIMIT, sortedMemos.length);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="@container w-full max-w-4xl min-h-full flex flex-col justify-start items-center sm:pt-4 pb-8">
      <MobileHeader />
      <div className="relative w-full h-auto flex flex-col justify-start items-start px-4">
        <MemoFilter />
        {sortedMemos.map((memo) => (
          <Memo key={memo.id} memo={memo} lazyRendering showCreator showParent />
        ))}

        {loadingStatus === "fetching" ? (
          <div className="flex flex-col justify-start items-center w-full mt-2 mb-1">
            <p className="text-sm text-gray-400 italic">{t("memo.fetching-data")}</p>
          </div>
        ) : (
          <div className="flex flex-col justify-start items-center w-full my-6">
            <div className="text-sm text-gray-400 italic">
              {loadingStatus === "complete" ? (
                sortedMemos.length === 0 && (
                  <div className="w-full mt-12 mb-8 flex flex-col justify-center items-center italic">
                    <Empty />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">{t("message.no-data")}</p>
                  </div>
                )
              ) : (
                <span ref={fetchMoreRef} className="cursor-pointer hover:text-green-600" onClick={handleFetchMoreClick}>
                  {t("memo.fetch-more")}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Explore;
