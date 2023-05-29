import { useEventListener } from '@huolala-tech/hooks';
import { useRef, HTMLAttributes } from 'react';

const { atan2, PI } = Math;

type Vec3 = [number, number, number];

const normalize = (a: Vec3): Vec3 => {
  const s = dot(a, a) ** 0.5;
  return [a[0] / s, a[1] / s, a[2] / s];
};

const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

const r2a = (r: number) => (r / PI) * 180;

const getCenterPoint = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  const x = rect.x + el.clientWidth / 2;
  const y = rect.y + el.clientHeight / 2;
  return { x, y };
};

const LIGHT_DIRECTION: Vec3 = [0, 0, 1];
const MOUSE_DISTANCE = 2000;
const BACKGROUND_LIGHT = 0.6;

export const MouseFocus = (props: HTMLAttributes<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null);

  useEventListener(
    'mousemove',
    (mouse: MouseEvent) => {
      const { current } = ref;
      if (!(current instanceof HTMLElement)) return;
      const point = getCenterPoint(current);
      const dx = mouse.clientX - point.x;
      const dy = mouse.clientY - point.y;

      const yaw = atan2(dx, MOUSE_DISTANCE);
      const pitch = atan2(-dy, MOUSE_DISTANCE);
      current.style.transform = `rotateY(${r2a(yaw)}deg) rotateX(${r2a(pitch)}deg)`;

      const panelDirection = normalize([dx, dy, MOUSE_DISTANCE]);
      const specularLight = dot(LIGHT_DIRECTION, panelDirection) ** 8;
      current.style.filter = `brightness(${specularLight + BACKGROUND_LIGHT})`;
    },
    { passive: true }
  );

  return <div ref={ref} {...props} />;
};
