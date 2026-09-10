import os
import cv2
import shutil

def main():
    queue_dir = r"D:\Project\backend\Verification_Queue"
    train_dir = r"D:\Project\backend\Needle-Angle-Detection-2\train"
    
    img_queue = os.path.join(queue_dir, "images")
    lbl_queue = os.path.join(queue_dir, "labels")
    
    img_train = os.path.join(train_dir, "images")
    lbl_train = os.path.join(train_dir, "labels")
    
    os.makedirs(img_train, exist_ok=True)
    os.makedirs(lbl_train, exist_ok=True)
    
    if not os.path.exists(img_queue):
        print(f"Queue directory not found: {img_queue}")
        return
        
    images = [f for f in os.listdir(img_queue) if f.endswith(('.jpg', '.png'))]
    if not images:
        print("Verification queue is empty! Extract frames first using extract_frames.py")
        return
        
    print(f"Found {len(images)} images to verify.")
    print("CONTROLS:")
    print("  [y] or [Space] : APPROVE (moves to training dataset)")
    print("  [n] or [Delete]: REJECT (deletes frame)")
    print("  [q] or [Esc]   : QUIT (saves progress)")
    print("---------------------------------------------------------")
    
    approved = 0
    rejected = 0
    
    for img_name in images:
        base_name = os.path.splitext(img_name)[0]
        lbl_name = base_name + ".txt"
        
        img_path = os.path.join(img_queue, img_name)
        lbl_path = os.path.join(lbl_queue, lbl_name)
        
        if not os.path.exists(lbl_path):
            continue
            
        img = cv2.imread(img_path)
        if img is None:
            continue
            
        h, w = img.shape[:2]
        
        with open(lbl_path, "r") as f:
            content = f.read().strip()
            
        if content:
            parts = content.split()
            class_id = parts[0]
            x_c, y_c, bw, bh = map(float, parts[1:])
            
            x1 = int((x_c - bw / 2) * w)
            y1 = int((y_c - bh / 2) * h)
            x2 = int((x_c + bw / 2) * w)
            y2 = int((y_c + bh / 2) * h)
            
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(img, f"Class: {class_id}", (x1, max(20, y1 - 10)), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                        
        cv2.putText(img, "Y = Approve | N = Reject | Q = Quit", (20, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
                    
        cv2.imshow("Verification Tool", img)
        
        while True:
            key = cv2.waitKey(0) & 0xFF
            if key in [ord('y'), ord(' '), 13]:  # y, space, enter
                shutil.move(img_path, os.path.join(img_train, img_name))
                shutil.move(lbl_path, os.path.join(lbl_train, lbl_name))
                print(f"Approved {img_name}")
                approved += 1
                break
            elif key in [ord('n'), 8, 127]: # n, backspace, delete
                os.remove(img_path)
                os.remove(lbl_path)
                print(f"Rejected {img_name}")
                rejected += 1
                break
            elif key in [ord('q'), 27]: # q, esc
                cv2.destroyAllWindows()
                print(f"\nProgress saved. Approved: {approved}, Rejected: {rejected}")
                return
                
    cv2.destroyAllWindows()
    print(f"\nQueue finished! Approved: {approved}, Rejected: {rejected}")
    print("Next step: Run python fine_tune.py to train the model on the approved images.")

if __name__ == "__main__":
    main()
