export const FAQ = () =>
    {
        return (
            <section className="py-24">
            <div className="container">
              <div className="section-heading text-center">
                <h2 className="section-title">Frequently Asked Questions</h2>
              </div>
              <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-stretch lg:justify-center">
                  <div className="p-10 border border-[#c9c8c8] rounded-3xl shadow-[0_7px_14px_#EAEAEA] max-w-xs w-full flex flex-col justify-between">
                    <div className="flex flex-col items-center">
                      <div className="flex justify-center items-center">
                        <h3 className="text-lg text-center font-bold text-black/60">Join the Waitlist</h3>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </section> 
        );
    }