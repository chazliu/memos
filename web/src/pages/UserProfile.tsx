import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import MemoList from "@/components/MemoList";
import MobileHeader from "@/components/MobileHeader";
import UserAvatar from "@/components/UserAvatar";
import useLoading from "@/hooks/useLoading";
import { useUserV1Store } from "@/store/v1";
import { User } from "@/types/proto/api/v2/user_service";
import { useTranslate } from "@/utils/i18n";

const UserProfile = () => {
  const t = useTranslate();
  const params = useParams();
  const userV1Store = useUserV1Store();
  const loadingState = useLoading();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const username = params.username;
    if (!username) {
      throw new Error("username is required");
    }

    userV1Store
      .getOrFetchUserByUsername(username)
      .then((user) => {
        setUser(user);
        loadingState.setFinish();
      })
      .catch((error) => {
        console.error(error);
        toast.error(t("message.user-not-found"));
      });
  }, [params.username]);

  return (
    <section className="w-full max-w-4xl min-h-full flex flex-col justify-start items-center sm:pt-4 pb-8">
      <MobileHeader />
      <div className="w-full px-4 flex flex-col justify-start items-center">
        {!loadingState.isLoading &&
          (user ? (
            <>
              <div className="w-full flex flex-col justify-start items-center py-8">
                <UserAvatar className="!w-20 !h-20 mb-2 drop-shadow" avatarUrl={user?.avatarUrl} />
                <p className="text-3xl text-black opacity-80 dark:text-gray-200">{user?.nickname}</p>
              </div>
              <MemoList />
            </>
          ) : (
            <p>Not found</p>
          ))}
      </div>
    </section>
  );
};

export default UserProfile;
