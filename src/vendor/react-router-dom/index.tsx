import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

export interface RouteObject {
  readonly path?: string;
  readonly element: React.ReactNode;
  readonly children?: RouteObject[];
  readonly index?: boolean;
}

export interface BrowserRouterInstance {
  readonly routes: RouteObject[];
}

export interface RouterProviderProps {
  readonly router: BrowserRouterInstance;
}

interface NavigationContextValue {
  readonly location: string;
  readonly navigate: (to: string) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

const OutletContext = createContext<React.ReactNode>(null);
const ParamsContext = createContext<Record<string, string>>({});

const isBrowser = typeof window !== "undefined";

const normalizePath = (path: string): string[] => {
  const clean = path.replace(/(^\/+|\/+?$)/g, "");
  if (!clean) {
    return [];
  }
  return clean.split("/");
};

const decodeSegment = (segment: string): string => {
  try {
    return decodeURIComponent(segment);
  } catch (error) {
    return segment;
  }
};

type MatchResult = {
  readonly element: React.ReactNode;
  readonly remaining: string[];
};

const wrapWithContexts = (
  element: React.ReactNode,
  outlet: React.ReactNode,
  params: Record<string, string>
): React.ReactNode => {
  return (
    <ParamsContext.Provider value={params}>
      <OutletContext.Provider value={outlet}>{element}</OutletContext.Provider>
    </ParamsContext.Provider>
  );
};

const matchRoute = (
  route: RouteObject,
  segments: readonly string[],
  params: Readonly<Record<string, string>>
): MatchResult | null => {
  const currentParams: Record<string, string> = { ...params };
  let remainingSegments = [...segments];

  if (route.index) {
    if (route.path && route.path !== "") {
      return null;
    }
    if (remainingSegments.length > 0) {
      return null;
    }
    const childMatch = route.children
      ? renderRoutes(route.children, remainingSegments, currentParams)
      : null;
    if (childMatch) {
      remainingSegments = childMatch.remaining;
    }
    const childElement = childMatch ? childMatch.element : null;
    return {
      element: wrapWithContexts(route.element, childElement, currentParams),
      remaining: remainingSegments
    };
  }

  if (route.path && route.path !== "" && route.path !== "*" && route.path !== "/") {
    const pathSegments = normalizePath(route.path);
    if (pathSegments.length > remainingSegments.length) {
      return null;
    }

    for (let index = 0; index < pathSegments.length; index += 1) {
      const expected = pathSegments[index];
      const actual = remainingSegments[index];

      if (expected.startsWith(":")) {
        const key = expected.slice(1);
        if (!key) {
          return null;
        }
        currentParams[key] = decodeSegment(actual);
        continue;
      }

      if (expected !== actual) {
        return null;
      }
    }

    remainingSegments = remainingSegments.slice(pathSegments.length);
  } else if (route.path === "*") {
    remainingSegments = [];
  }

  const childMatch = route.children
    ? renderRoutes(route.children, remainingSegments, currentParams)
    : null;

  if (childMatch) {
    remainingSegments = childMatch.remaining;
  }

  const childElement = childMatch ? childMatch.element : null;

  if (route.children && !childMatch && remainingSegments.length > 0) {
    return null;
  }

  return {
    element: wrapWithContexts(route.element, childElement, currentParams),
    remaining: remainingSegments
  };
};

const renderRoutes = (
  routes: readonly RouteObject[],
  segments: readonly string[],
  params: Readonly<Record<string, string>>
): MatchResult | null => {
  for (const route of routes) {
    const match = matchRoute(route, segments, params);
    if (match) {
      if (match.remaining.length > 0) {
        // there are unmatched segments that no child consumed
        continue;
      }
      return match;
    }
  }
  return null;
};

const resolveTo = (to: string, current: string): string => {
  if (!to) {
    return current;
  }

  if (to.startsWith("http://") || to.startsWith("https://")) {
    return to;
  }

  if (to.startsWith("/")) {
    return to;
  }

  const baseSegments = normalizePath(current);
  const targetSegments = normalizePath(to);

  for (const segment of targetSegments) {
    if (segment === "..") {
      baseSegments.pop();
    } else if (segment !== ".") {
      baseSegments.push(segment);
    }
  }

  return `/${baseSegments.join("/")}`;
};

export const createBrowserRouter = (routes: RouteObject[]): BrowserRouterInstance => ({
  routes
});

export const RouterProvider: React.FC<RouterProviderProps> = ({ router }) => {
  const initialPath = isBrowser ? window.location.pathname : "/";
  const [location, setLocation] = useState(initialPath);
  const routesRef = useRef(router.routes);

  useEffect(() => {
    routesRef.current = router.routes;
  }, [router.routes]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const handlePopState = () => {
      setLocation(window.location.pathname || "/");
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigate = useCallback(
    (to: string) => {
      if (!isBrowser) {
        return;
      }
      const target = resolveTo(to, window.location.pathname || "/");
      if (target.startsWith("http://") || target.startsWith("https://")) {
        window.location.href = target;
        return;
      }
      if (target === window.location.pathname) {
        return;
      }
      window.history.pushState(null, "", target);
      setLocation(target);
    },
    []
  );

  const element = useMemo(() => {
    const match = renderRoutes(routesRef.current, normalizePath(location), {});
    return match ? match.element : null;
  }, [location]);

  return (
    <NavigationContext.Provider value={{ location, navigate }}>
      {element}
    </NavigationContext.Provider>
  );
};

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  readonly to: string;
}

export const Link: React.FC<LinkProps> = ({ to, onClick, target, rel, ...rest }) => {
  const navigation = useContext(NavigationContext);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) {
        return;
      }

      if (target === "_blank" || (rel && rel.includes("external"))) {
        return;
      }

      if (!navigation) {
        return;
      }

      event.preventDefault();
      navigation.navigate(to);
    },
    [navigation, onClick, rel, target, to]
  );

  const href = navigation ? resolveTo(to, navigation.location) : to;

  return <a {...rest} href={href} onClick={handleClick} target={target} rel={rel} />;
};

export const Outlet: React.FC = () => {
  const outlet = useContext(OutletContext);
  return outlet ? <>{outlet}</> : null;
};

export function useParams<TParams extends Record<string, string>>() {
  return useContext(ParamsContext) as TParams;
}

export function useNavigate() {
  const navigation = useContext(NavigationContext);
  if (!navigation) {
    throw new Error("useNavigate must be used within a RouterProvider");
  }
  return navigation.navigate;
}

export function useLocation() {
  const navigation = useContext(NavigationContext);
  if (!navigation) {
    throw new Error("useLocation must be used within a RouterProvider");
  }
  return navigation.location;
}
