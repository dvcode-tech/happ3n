import { IdentityProvider } from "@bundly/ares-core";
import {
  useClient,
  useCurrentProvider,
  useProviders,
} from "@bundly/ares-react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/router";
import { DropdownMenuShortcut } from "../ui/dropdown-menu";

function selectProvider(providers: IdentityProvider[]): IdentityProvider {
  if (providers.length === 0) {
    throw new Error("No providers available");
  }

  if (providers.length === 1) {
    return providers[0];
  }

  // TODO: Display view to select provider
  return providers[0];
}

const LoginButton = ({
  children = null,
  className = "",
  ...props
}: {
  [x: string]: any;
  children?: any;
  className?: string | undefined;
}) => {
  const client = useClient();
  const providers = useProviders();

  async function login() {
    try {
      const provider = selectProvider(providers);

      await client.setCurrentProvider(provider.name);

      await provider.connect();
    } catch (error) {
      await client.removeCurrentProvider();
    }
  }

  return (
    <button onClick={() => login()} className={className} {...props}>
      {children || "Sign In"}
    </button>
  );
};

function LogoutButton({ children = null, className = "", ...props }) {
  const client = useClient();
  const router = useRouter();
  const provider = useCurrentProvider();

  async function logout() {
    if (!provider) {
      throw new Error("No identity provider selected");
    }

    try {
      await provider.disconnect();
      await client.removeCurrentProvider();
      router.push("/");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return (
    <button onClick={() => logout()} className={className} {...props}>
      <div className="flex items-center">
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </div>
    </button>
  );
}

export { LoginButton, LogoutButton };
