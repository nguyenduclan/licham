// true khi JavaScript đã chạy trên trình duyệt (sau hydrate), false lúc render trên server.
// Dùng để KHÓA nút gửi của các form chứa dữ liệu cá nhân cho tới khi JS sẵn sàng: nếu bấm sớm,
// trình duyệt sẽ tự gửi form theo kiểu mặc định (GET) và đưa dữ liệu lên URL.
import { useSyncExternalStore } from "react";

const noop = () => () => {};

export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}
