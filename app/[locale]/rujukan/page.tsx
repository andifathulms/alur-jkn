import { redirect } from 'next/navigation';

/** DESIGN.md v2 §4: INA-CBG is the spine — the reference layer's default landing. */
export default function RujukanIndexPage() {
  redirect('/id/rujukan/ina-cbg');
}
