// Link "hai vai": có href thật để Google lần theo được, nhưng khi người dùng bấm thường thì xử lý
// ngay trên trang (đổi state) thay vì chuyển trang. Ctrl/Cmd/Shift/chuột giữa vẫn mở trang như link thường.
import type { MouseEvent } from "react";

export function inPlaceClick(action: () => void) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    action();
  };
}
