export interface User {
    id: number;
    login: string;
    email: string;
    first_name: string;
    last_name: string;
    usual_full_name: string | null;
    phone: string | null;
    displayname: string;
    image: UserImage;
    location: string | null;
    wallet: number;
    correction_point: number;
    pool_month: string | null;
    pool_year: string | null;
    cursus_users: CursusUser[];
    projects_users: ProjectUser[];
    campus: Campus[];
}

export interface UserImage {
    link: string | null;
    versions: {
        large: string | null;
        medium: string | null;
        small: string | null;
        micro: string | null;
    };
}

export interface CursusUser {
    id: number;
    begin_at: string;
    end_at: string | null;
    grade: string | null;
    level: number;
    skills: Skill[];
    cursus_id: number;
    has_coalition: boolean;
    cursus: {
        id: number;
        name: string;
        slug: string;
    };
}

export interface Skill {
    id: number;
    name: string;
    level: number;
}

export interface ProjectUser {
    id: number;
    occurrence: number;
    final_mark: number | null;
    status: 'finished' | 'in_progress' | 'searching_a_group' | 'creating_group';
    validated?: boolean;
    current_team_id: number | null;
    project: {
        id: number;
        name: string;
        slug: string;
        parent_id: number | null;
    };
    cursus_ids: number[];
    marked_at: string | null;
    marked: boolean;
    retriable_at: string | null;
}

export interface Campus {
    id: number;
    name: string;
    time_zone: string;
    language: {
        id: number;
        name: string;
        identifier: string;
    };
    country: string;
    city: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface ApiError {
    error: string;
    error_description?: string;
}
