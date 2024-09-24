import AdSense from './AdSense';

export default function AdSidebar() {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <div className="rounded-2xl bg-card p-5 shadow-sm">
        <AdSense />
      </div>
    </div>
  );
}