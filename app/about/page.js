export default function AboutPage() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-lg">
              We strive to create innovative solutions that make task management simple 
              and efficient for everyone. Our todo list application is just the beginning 
              of our journey to help people stay organized and productive.
            </p>
          </section>
  
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-medium mb-2">Task Management</h3>
                <p>
                  Streamlined todo lists that help you organize your daily tasks 
                  and boost productivity with a clean, intuitive interface.
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-medium mb-2">Progress Tracking</h3>
                <p>
                  Keep track of your completed tasks and monitor your productivity 
                  with our simple yet effective tracking system.
                </p>
              </div>
            </div>
          </section>
  
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="text-lg mb-6">
              We're a passionate team of developers and designers dedicated to 
              creating the best possible user experience. Our diverse backgrounds 
              and skill sets allow us to approach problems from different angles 
              and create innovative solutions.
            </p>
          </section>
  
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-lg">
              Have questions or suggestions? We'd love to hear from you! 
              Reach out to us at{' '}
              <a 
                href="mailto:contact@example.com" 
                className="text-blue-500 hover:text-blue-600 underline"
              >
                contact@example.com
              </a>
            </p>
          </section>
        </div>
      </div>
    );
  }